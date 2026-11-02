import vinext from "vinext";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { readExecutionProfile } from "./scripts/execution-profile.mjs";
import { sites } from "./build/sites-vite-plugin";
import { connectorPreview } from "./build/connector-preview-plugin.mjs";
import { existsSync, readFileSync } from "node:fs";

type LearningInfrastructure = { databaseId?: string; databaseName?: string; bucketName?: string };
const learningPath = new URL('./learning-infra.json', import.meta.url);
const learning: LearningInfrastructure = existsSync(learningPath) ? JSON.parse(readFileSync(learningPath, 'utf8')) : {};
if (learning.databaseId && !/^[a-f0-9-]{36}$/.test(learning.databaseId)) throw new Error('Invalid learning-infra.json databaseId');

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";
const managedLinux = readExecutionProfile() === "managed-linux";

const localBindingConfig = {
  name: "khmerone",
  main: "./build/sites-worker.ts",
  compatibility_flags: ["nodejs_compat"],
  vars: { AZURE_SPEECH_REGION: "southeastasia" },
  durable_objects: { bindings: [{ name: 'QUIZ_ROOMS', class_name: 'QuizRoom' }] },
  migrations: [{ tag: 'learning-v1', new_sqlite_classes: ['QuizRoom'] }],
  ratelimits: [{
    name: "SPEECH_RATE_LIMITER",
    namespace_id: "2026102801",
    simple: { limit: 5, period: 60 as const },
  }, { name: 'LEARNING_RATE_LIMITER', namespace_id: '2026102901', simple: { limit: 20, period: 60 as const } },
  { name: 'ROOM_RATE_LIMITER', namespace_id: '2026102902', simple: { limit: 600, period: 60 as const } }],
  d1_databases: [...(learning.databaseId ? [{ binding: 'LEARNING_DB', database_name: learning.databaseName || 'khmerone-learning', database_id: learning.databaseId, migrations_dir: './migrations' }] : []), ...(d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [])],
  r2_buckets: [...(learning.bucketName ? [{ binding: 'LEARNING_FILES', bucket_name: learning.bucketName }] : []), ...(r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [])],
};

export default defineConfig(async ({ command }) => {
  // Use Miniflare's local Request.cf placeholder unless fetching is requested.
  process.env.CLOUDFLARE_CF_FETCH_ENABLED ??= "false";
  process.env.WRANGLER_SEND_METRICS ??= "false";

  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.WRANGLER_REGISTRY_PATH ??= ".wrangler/dev-registry";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: {
      ...(managedLinux
        ? { host: "0.0.0.0", allowedHosts: ["terminal.local"] }
        : {}),
      ...(isCodexSeatbeltSandbox
        ? { watch: { useFsEvents: false, usePolling: true } }
        : {}),
    },
    plugins: [
      vinext(),
      sites({ mockAuth: !managedLinux }),
      connectorPreview(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
        config: {
          ...localBindingConfig,
          ...(command === "serve"
            ? {
                services: [
                  {
                    binding: "CONNECTORS",
                    service: "sites-connector-preview",
                    entrypoint: "ConnectorPreview",
                  },
                ],
              }
            : {}),
        },
        ...(command === "serve"
          ? {
              auxiliaryWorkers: [
                {
                  config: {
                    name: "sites-connector-preview",
                    main: "./build/connector-preview-worker.mjs",
                    compatibility_date: "2026-05-15",
                  },
                },
              ],
            }
          : {}),
      }),
    ],
  };
});
