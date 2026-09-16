const STAGING_ENDPOINT = 'https://frontapi.staging.elementaree.org/replit/notification/send';
const PRODUCTION_ENDPOINT = 'https://api-new.elementaree.ru/replit/notification/send';
const ALLOWED_ENDPOINTS = new Set([STAGING_ENDPOINT, PRODUCTION_ENDPOINT]);
const CHANNELS = new Map([['236716915', '1'], ['184249890', '0']]);

function notificationParams(act, isNew) {
  const gid = String(act?.source_row || '').split(':')[0];
  const isMeat = CHANNELS.get(gid);
  if (isMeat === undefined) throw new Error('Акт не связан с заданием из поддерживаемой вкладки');
  return new URLSearchParams({
    actNo: String(act.id),
    source: String(act.raw_material || act.product_name || ''),
    producer: String(act.manufacturer || ''),
    provider: String(act.supplier || ''),
    date: String(act.date || '').slice(0, 10),
    isMeat,
    isNew: isNew ? '1' : '0',
  });
}

async function notifyActSafely(act, isNew, { env = process.env, fetchImpl = fetch, log = console.info } = {}) {
  let httpStatus = null;
  const finish = (result, reason) => {
    // Log only controlled metadata, never supplier data, URLs, tokens or provider messages.
    const entry = {
      time: new Date().toISOString(),
      actId: Number.isSafeInteger(Number(act?.id)) ? Number(act.id) : null,
      isNew: isNew ? 1 : 0,
      isMeat: CHANNELS.get(String(act?.source_row || '').split(':')[0]) ?? null,
      httpStatus, status: result.status, reason,
    };
    try { log('[act-notification] ' + JSON.stringify(entry)); } catch {}
    return result;
  };
  if (env.ACT_NOTIFICATIONS_ENABLED !== 'true') return finish({ status: 'disabled' }, 'disabled');
  const fail = (reason, code = 'rejected') => finish({
    status: 'error',
    message: `Акт сохранён, но доставка уведомления не подтверждена: ${reason}.`,
  }, code);
  if (!env.ACT_NOTIFICATION_TOKEN) return fail('не настроен токен уведомлений');
  const endpoint = env.ACT_NOTIFICATION_ENDPOINT || STAGING_ENDPOINT;
  if (!ALLOWED_ENDPOINTS.has(endpoint)) return fail('неверно настроен адрес сервиса уведомлений', 'invalid_endpoint');
  let params;
  try { params = notificationParams(act, isNew); }
  catch { return fail('акт не связан с заданием из поддерживаемой вкладки'); }
  params.set('auth_token', env.ACT_NOTIFICATION_TOKEN);
  const url = new URL(endpoint);
  url.search = params.toString();
  try {
    // Never log the URL, response body or raw exception: the API uses a query-string secret.
    // No retries: a timeout may occur after the service has already sent the notification.
    const response = await fetchImpl(url, {
      method: 'GET', redirect: 'error', signal: AbortSignal.timeout(8000),
      headers: { Accept: 'application/json', 'Cache-Control': 'no-store' },
    });
    httpStatus = response.status;
    if (!response.ok) return fail(`сервис вернул HTTP ${response.status}`);
    const body = await response.text();
    let result;
    try { result = JSON.parse(body); } catch { return fail('сервис вернул неожиданный ответ', 'invalid_response'); }
    const denied = value => value === false || value === 0 || value === 'false' || value === '0';
    if (denied(result?.success) || denied(result?.ok) || result?.error ||
        ['error', 'failed', 'failure'].includes(result?.status)) return fail('сервис отклонил запрос');
    if (result?.success !== true && result?.ok !== true) {
      return fail('в ответе сервиса нет явного подтверждения приёма запроса', 'unconfirmed_response');
    }
    // API acceptance is not proof that a message reached its final channel.
    return finish({ status: 'accepted' }, 'api_accepted');
  } catch {
    return fail('сервис недоступен или не ответил вовремя', 'network_or_timeout');
  }
}

module.exports = { notificationParams, notifyActSafely };