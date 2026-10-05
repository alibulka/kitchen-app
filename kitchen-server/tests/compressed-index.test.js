const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs/promises');
const { resolve, join } = require('node:path');
const { tmpdir } = require('node:os');
const { gunzipSync } = require('node:zlib');
const express = require('express');
const { createCompressedIndexHandler } = require('../lib/compressed-index');

function request(server, headers = {}, method = 'GET', path = '/') {
  return new Promise((resolve, reject) => {
    const req = http.request({
      host: '127.0.0.1', port: server.address().port, path, headers, method,
    }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.end();
  });
}

async function serve(t, indexPath) {
  const app = express();
  app.get(['/', '/index.html'], createCompressedIndexHandler(indexPath));
  app.get(['/', '/index.html'], (_req, res) => res.sendFile(indexPath));
  app.get('/api/example', (_req, res) => res.json({ fact: 35 }));
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  return server;
}

test('gzip transfers a smaller page that decodes to the exact original, with encoding negotiation and cache validators', async t => {
  const index = resolve(__dirname, '../public/index.html');
  const original = await fs.readFile(index);
  const server = await serve(t, index);
  const compressed = await request(server, { 'Accept-Encoding': 'gzip' });
  assert.equal(compressed.status, 200);
  assert.equal(compressed.headers['content-encoding'], 'gzip');
  assert.match(compressed.headers['content-type'], /text\/html/);
  assert.match(compressed.headers.vary, /Accept-Encoding/);
  assert.ok(compressed.body.length < original.length * 0.4);
  assert.deepEqual(gunzipSync(compressed.body), original);
  const uncompressed = await request(server);
  assert.equal(uncompressed.headers['content-encoding'], undefined);
  assert.deepEqual(uncompressed.body, original);
  const disabled = await request(server, { 'Accept-Encoding': 'gzip;q=0, identity;q=1' }, 'GET', '/index.html');
  assert.equal(disabled.headers['content-encoding'], undefined);
  assert.deepEqual(disabled.body, original);
  const cached = await request(server, {
    'Accept-Encoding': 'gzip', 'If-None-Match': compressed.headers.etag,
  });
  assert.equal(cached.status, 304);
  assert.equal(cached.body.length, 0);
  const head = await request(server, { 'Accept-Encoding': 'gzip' }, 'HEAD');
  assert.equal(head.status, 200);
  assert.equal(head.headers['content-encoding'], 'gzip');
  assert.equal(head.body.length, 0);
});

test('page edits invalidate the compressed cache, and API responses are untouched', async t => {
  const dir = await fs.mkdtemp(join(tmpdir(), 'kitchen-compression-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const index = join(dir, 'index.html');
  await fs.writeFile(index, '<html>Version one</html>');
  const server = await serve(t, index);
  const first = await request(server, { 'Accept-Encoding': 'gzip' });
  await fs.writeFile(index, '<html>Updated version with more text</html>');
  const second = await request(server, { 'Accept-Encoding': 'gzip' });
  assert.equal(gunzipSync(second.body).toString(), '<html>Updated version with more text</html>');
  assert.notEqual(first.headers.etag, second.headers.etag);
  const api = await request(server, { 'Accept-Encoding': 'gzip' }, 'GET', '/api/example');
  assert.equal(api.headers['content-encoding'], undefined);
  assert.deepEqual(JSON.parse(api.body), { fact: 35 });
});
