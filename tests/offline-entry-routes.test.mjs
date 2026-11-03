import assert from 'node:assert/strict';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

test('saved packs serve redirected HTML as a usable offline navigation response', async t => {
  const html = '<h1>Offline lesson</h1>';
  const server = createServer((req, res) => {
    if (req.url.endsWith('/index.html')) {
      res.writeHead(307, { Location: './' }).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(html);
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const origin = `http://127.0.0.1:${server.address().port}`;

  for (const area of ['learning-labs', 'virtual-microscope', 'brain-scan-explorer', 'body-works']) {
    await t.test(area, async () => {
      const directory = `${origin}/${area}/`;
      const entry = directory + 'index.html';
      const saved = await fetch(entry);
      assert.equal(saved.redirected, true);
      const events = new Map();
      const cache = { match: async input => {
        const url = new URL(typeof input === 'string' ? input : input.url);
        if (url.pathname.endsWith('/offline-ready')) return Response.json({ cache: 'saved-pack' });
        if (url.pathname === `/${area}/index.html`) return saved.clone();
      } };
      runInNewContext(await readFile(`public/${area}/sw.js`, 'utf8'), {
        self: { location: new URL(directory + 'sw.js'), addEventListener: (name, handler) => events.set(name, handler) },
        caches: { open: async () => cache }, URL, Response,
        fetch: async () => { throw new TypeError('Offline'); },
      });

      for (const url of [entry, directory]) {
        let pending;
        events.get('fetch')({ request: new Request(url + '?lang=km', { redirect: 'manual' }), respondWith: result => { pending = result; } });
        const response = await pending;
        assert.equal(response.status, 200);
        assert.equal(response.redirected, false, 'navigations cannot replay a followed redirect');
        assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
        assert.equal(await response.text(), html);
      }
    });
  }
});
