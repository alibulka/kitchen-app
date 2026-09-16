const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { notificationParams, notifyActSafely } = require('../lib/act-notifications');
const act = { id: 123, source_row: '236716915:id:225', date: '2026-09-02',
  raw_material: 'Мясо мидий', product_name: 'Другое название',
  manufacturer: 'Inversiones Coihuin Limitada №10800', supplier: 'Глобал & Co' };
const env = { ACT_NOTIFICATIONS_ENABLED: 'true', ACT_NOTIFICATION_TOKEN: 'test-only-token' };
const productionEndpoint = 'https://api-new.elementaree.ru/replit/notification/send';

test('deployment config uses the allowlisted production endpoint', () => {
  const replitConfig = readFileSync(resolve(__dirname, '../../.replit'), 'utf8');
  const productionBlock = replitConfig.match(/\[userenv\.production\]([\s\S]*?)(?=\n\[|$)/)?.[1] || '';
  assert.match(productionBlock, new RegExp(
    `ACT_NOTIFICATION_ENDPOINT\\s*=\\s*["']${productionEndpoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`
  ));
});

test('GET payload encodes exact fields, channel and create/update flags', async () => {
  for (const [gid, isMeat] of [['236716915', '1'], ['184249890', '0']]) {
    for (const isNew of [true, false]) {
      let calls = 0;
      const result = await notifyActSafely({ ...act, source_row: `${gid}:id:822` }, isNew, {
        env, fetchImpl: async (url, options) => {
          calls++;
          assert.equal(url.origin + url.pathname, 'https://frontapi.staging.elementaree.org/replit/notification/send');
          assert.deepEqual(Object.fromEntries(url.searchParams), {
            actNo: '123', source: act.raw_material, producer: act.manufacturer,
            provider: act.supplier, date: act.date, isMeat, isNew: isNew ? '1' : '0',
            auth_token: env.ACT_NOTIFICATION_TOKEN,
          });
          assert.equal(options.method, 'GET');
          assert.equal(options.redirect, 'error');
          assert.ok(options.signal instanceof AbortSignal);
          return new Response('{"success":true}');
        },
      });
      assert.deepEqual(result, { status: 'accepted' });
      assert.equal(calls, 1);
    }
  }
  assert.equal(notificationParams({ ...act, raw_material: '' }, false).get('source'), act.product_name);
  assert.equal(notificationParams({ ...act, source_row: '236716915:225' }, true).get('isMeat'), '1');
});

test('production endpoint is selected only by explicit environment configuration', async () => {
  let requestedUrl;
  const result = await notifyActSafely(act, false, {
    env: { ...env, ACT_NOTIFICATION_ENDPOINT: productionEndpoint },
    fetchImpl: async url => {
      requestedUrl = url;
      return new Response('{"success":true}');
    },
  });
  assert.equal(result.status, 'accepted');
  assert.equal(requestedUrl.origin + requestedUrl.pathname, productionEndpoint);
  assert.equal(requestedUrl.searchParams.get('auth_token'), env.ACT_NOTIFICATION_TOKEN);

  let calls = 0;
  const invalid = await notifyActSafely(act, false, {
    env: { ...env, ACT_NOTIFICATION_ENDPOINT: 'https://example.com/notification/send' },
    fetchImpl: async () => { calls++; return new Response('{"success":true}'); },
  });
  assert.equal(invalid.status, 'error');
  assert.equal(calls, 0);
});

test('disabled, unconfigured and unlinked requests never contact service', async () => {
  const fetchImpl = () => { throw Error('Must not call'); };
  assert.equal((await notifyActSafely(act, true, { env: {}, fetchImpl })).status, 'disabled');
  assert.equal((await notifyActSafely(act, true, {
    env: { ACT_NOTIFICATIONS_ENABLED: 'true' }, fetchImpl,
  })).status, 'error');
  for (const source_row of [null, 'unknown:1']) {
    assert.equal((await notifyActSafely({ ...act, source_row }, false, { env, fetchImpl })).status, 'error');
  }
});

test('HTTP, API rejection and timeout warn without leaking secrets or retrying', async () => {
  for (const response of [
    () => new Response('secret body', { status: 503 }),
    () => new Response('{"ok":false}'),
    () => new Response('{"error":"secret body"}'),
    () => new Response('{"ok":0}'),
    () => new Response('{"success":"false"}'),
    () => new Response('{}'),
    () => new Response(''),
    () => new Response('<html>Login</html>'),
    () => { throw Error(env.ACT_NOTIFICATION_TOKEN); },
  ]) {
    let calls = 0;
    const result = await notifyActSafely(act, false, {
      env, fetchImpl: async () => { calls++; return response(); },
    });
    assert.equal(result.status, 'error');
    assert.match(result.message, /Акт сохранён/);
    assert.ok(!JSON.stringify(result).includes(env.ACT_NOTIFICATION_TOKEN));
    assert.ok(!JSON.stringify(result).includes('secret body'));
    assert.equal(calls, 1);
  }
});

test('audit records acceptance without logging credentials, URLs or provider message', async () => {
  const logs = [];
  const result = await notifyActSafely(act, false, {
    env, log: entry => logs.push(entry),
    fetchImpl: async () => new Response(JSON.stringify({ success: true, message: env.ACT_NOTIFICATION_TOKEN })),
  });
  assert.equal(result.status, 'accepted');
  assert.equal(logs.length, 1);
  const entry = JSON.parse(logs[0].slice('[act-notification] '.length));
  assert.equal(entry.actId, act.id);
  assert.equal(entry.isNew, 0);
  assert.equal(entry.isMeat, '1');
  assert.equal(entry.httpStatus, 200);
  assert.equal(entry.status, 'accepted');
  for (const value of [env.ACT_NOTIFICATION_TOKEN, act.raw_material, act.manufacturer, act.supplier, 'https://']) {
    assert.ok(!logs[0].includes(value));
  }
});