// Run from an authenticated checkout. Ordinary GitHub preview builds use their own command.
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { setTimeout as delay } from 'node:timers/promises';

const root = resolve(import.meta.dirname, '..');
const worker = 'khmerone';
const production = 'https://khmerone.jaredrobertw.workers.dev';
const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const services = ['speech', 'translation', 'rooms', 'exchange', 'uploads', 'editor'];
const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
const versionUrl = id => production.replace('https://', 'https://' + id.slice(0, 8) + '-');

function activeVersion(deployment) {
  const versions = deployment?.versions;
  if (!deployment?.id || versions?.length !== 1 || versions[0].percentage !== 100 || !uuid.test(versions[0].version_id)) {
    throw new Error('A release requires one identified production version receiving 100% of traffic.');
  }
  return versions[0].version_id;
}

function releaseConfig(built, bindings, migrationDir) {
  if (built.name !== worker) throw new Error('The built configuration must target the khmerone Worker.');
  const db = bindings.find(b => b.type === 'd1' && b.name === 'LEARNING_DB');
  const files = bindings.find(b => b.type === 'r2_bucket' && b.name === 'LEARNING_FILES');
  if (!uuid.test(db?.id) || !files?.bucket_name) throw new Error('The active version must identify its learning database and file bucket.');
  for (const local of built.d1_databases ?? []) {
    if (local.binding !== db.name || local.database_id !== db.id) throw new Error('The built database configuration differs from production.');
  }
  for (const local of built.r2_buckets ?? []) {
    if (local.binding !== files.name || local.bucket_name !== files.bucket_name) throw new Error('The built file-storage configuration differs from production.');
  }
  return {
    ...built, vars: {}, keep_vars: true,
    d1_databases: [{ binding: db.name, database_id: db.id, migrations_dir: migrationDir }],
    r2_buckets: [{ binding: files.name, bucket_name: files.bucket_name, ...(files.jurisdiction ? {jurisdiction: files.jurisdiction} : {}) }],
  };
}

function bindingMap(bindings) {
  return Object.fromEntries(bindings.map(b => [b.name, b.type === 'assets' ? { type: b.type, name: b.name } : b]));
}

async function afterPropagation(read) {
  for (const wait of [0, 1500, 4000]) {
    await delay(wait);
    try { return await read(); } catch { /* Allow a new version to propagate. */ }
  }
  return read();
}

async function checkSite(origin, { directory = false, archive = false } = {}) {
  async function request(path) {
    const url = new URL(path, origin);
    url.searchParams.set('release-check', randomUUID());
    const response = await fetch(url, { redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(url.pathname + ' returned HTTP ' + response.status + ' at ' + origin);
    return response;
  }
  const status = await (await request('/api/learning/status')).json();
  if (!services.every(name => status[name] === true)) throw new Error('One or more existing learning services are unavailable at ' + origin);
  if (directory) {
    const home = await (await request('/')).text();
    const ministries = await (await request('/ministries?lang=en')).text();
    if (!['educational-tools','ministry-tools'].every(id => home.includes('id="' + id + '"')) ||
        (ministries.match(/class="mg-card"/g) ?? []).length < 24) throw new Error('The new tool directories are missing at ' + origin);
  }
  if (archive && !Array.isArray((await (await request('/api/learning/culture')).json())?.items)) {
    throw new Error('The public culture archive is unavailable at ' + origin);
  }
}

// The same sequence is tested with a simulated provider, including failures before promotion.
export async function release({ built, migrationDir, status, view, configure, upload, migrate, promote, check, checkOnly, log = console.log }) {
  const previous = await status();
  const live = activeVersion(previous);
  const original = (await view(live)).resources.bindings;
  const config = releaseConfig(built, original, migrationDir);
  await check(production);
  // Confirm the selected account's production version is accessible on the owner's known hostname.
  await check(versionUrl(live));
  if (checkOnly) { log('Production version, storage identities and six service flags verified.'); return; }

  await configure(config);
  const candidate = await upload();
  if (!uuid.test(candidate?.version_id) || candidate.worker_name !== worker || candidate.preview_url !== versionUrl(candidate.version_id)) {
    throw new Error('Could not verify a version preview on the existing Khmer One hostname. Production traffic was not switched.');
  }
  const version = candidate.version_id;
  const candidateBindings = (await view(version)).resources.bindings;
  if (!isDeepStrictEqual(bindingMap(original), bindingMap(candidateBindings))) throw new Error('Candidate bindings differ from the live version. Production traffic was not switched.');
  await check(candidate.preview_url, {directory: true});
  const unchanged = async () => {
    const current = await status();
    if (current.id !== previous.id || activeVersion(current) !== live) throw new Error('Production changed during release. Inspect the new deployment before trying again.');
  };
  await unchanged();
  await migrate();
  await check(candidate.preview_url, {directory: true, archive: true});
  await unchanged();
  log('Promoting the checked version. Previous production version: ' + live);
  await promote(version);
  await afterPropagation(async () => {
    if (activeVersion(await status()) !== version) throw new Error('Cloudflare did not confirm the requested version at 100% traffic.');
  });
  await check(production, {directory: true, archive: true});
  log('Verified the educational tools, ministry directory, archive and service configuration at ' + production);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--check')) throw new Error('Use no arguments to release, or --check for a read-only preflight.');
  if (process.env.WORKERS_CI || process.env.WRANGLER_CI_OVERRIDE_NAME) throw new Error('Run this owner release from an authenticated checkout outside Workers Builds.');
  const generated = resolve(root, 'dist/server/wrangler.json');
  const built = readJson(generated);
  const scratch = mkdtempSync(join(tmpdir(), 'khmerone-release-'));
  // A sibling configuration preserves relative Worker and static asset paths.
  const configured = join(dirname(generated), 'wrangler-release-' + randomUUID() + '.json');
  const receipt = join(scratch, 'upload.jsonl');
  const migrationDir = join(scratch, 'migrations');
  const wrangler = resolve(root, 'node_modules/wrangler/bin/wrangler.js');
  function run(args, config = generated, env = {}) {
    const result = spawnSync(process.execPath, [wrangler, ...args, '--config', config], {
      cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
      env: {...process.env, WRANGLER_SEND_METRICS: 'false', ...env}, stdio: ['ignore','pipe','inherit'],
    });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error('Wrangler ' + args.slice(0, 2).join(' ') + ' failed. Check Wrangler sign-in, the selected account and its permissions.');
    return result.stdout;
  }
  try {
    await release({
      built, migrationDir, checkOnly: args.includes('--check'), check: (...input) => afterPropagation(() => checkSite(...input)),
      status: () => JSON.parse(run(['deployments', 'status', '--name', worker, '--json'])),
      view: id => JSON.parse(run(['versions', 'view', id, '--name', worker, '--json'])),
      configure: config => {
        mkdirSync(migrationDir);
        const migration = '0003_culture_archive.sql';
        copyFileSync(resolve(root, 'migrations', migration), join(migrationDir, migration));
        writeFileSync(configured, JSON.stringify(config), {mode: 0o600, flag: 'wx'});
      },
      upload: () => {
        console.log('Uploading a candidate version with the current production storage bindings.');
        run(['versions', 'upload', '--name', worker, '--keep-vars', '--message', 'Khmer One educational and ministry tools'], configured, {WRANGLER_OUTPUT_FILE_PATH: receipt});
        return readFileSync(receipt, 'utf8').trim().split('\n').map(line => JSON.parse(line)).find(row => row.type === 'version-upload');
      },
      migrate: () => {
        console.log('Applying the culture archive migration to the verified production database.');
        run(['d1', 'migrations', 'apply', 'LEARNING_DB', '--remote'], configured);
      },
      promote: id => run(['versions', 'deploy', id + '@100%', '--name', worker, '--yes', '--message', 'Publish verified Khmer One ministry tools'], configured),
    });
  } finally {
    rmSync(configured, {force: true});
    rmSync(scratch, {recursive: true, force: true});
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
