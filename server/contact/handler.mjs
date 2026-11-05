import {validEmail} from './config.mjs';

const maxBody = 16 * 1024;
const maxClients = 5000;
const windowMs = 15 * 60 * 1000;

/** Pure HTTP handler: tests inject a provider transport; no credential reaches the client. */
export function createContactHandler(config, {transport = fetch, now = Date.now, log = console.error} = {}) {
  const clients = new Map();
  let globalBucket = {start: now(), count: 0};
  function limited(address) {
    const time = now();
    for (const [ip, item] of clients) if (time - item.start >= windowMs) clients.delete(ip);
    let item = clients.get(address);
    if (!item) {
      if (clients.size >= maxClients) return true;
      item = {start: time, count: 0};
      clients.set(address, item);
    }
    if (time - globalBucket.start >= windowMs) globalBucket = {start: time, count: 0};
    item.count++;
    globalBucket.count++;
    return item.count > 5 || globalBucket.count > 100;
  }
  return async function handle(request, address = 'unknown') {
    const path = new URL(request.url).pathname;
    const origin = request.headers.get('origin');
    const headers = {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', Vary: 'Origin'};
    const reply = (status, data, extra = {}) => new Response(JSON.stringify(data), {status, headers: {...headers, ...extra}});
    if (path === '/health' && request.method === 'GET') return reply(config.ready ? 200 : 503, {ready: config.ready});
    if (path !== '/api/contact') return reply(404, {ok: false});
    if (!origin || !config.origins.has(origin)) return reply(403, {ok: false});
    headers['Access-Control-Allow-Origin'] = origin;
    if (request.method === 'OPTIONS') return new Response(null, {
      status: 204,
      headers: {...headers, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Accept', 'Access-Control-Max-Age': '600'}
    });
    if (request.method !== 'POST') return reply(405, {ok: false}, {Allow: 'POST, OPTIONS'});
    if (!config.ready) return reply(503, {ok: false});
    if (limited(address)) return reply(429, {ok: false}, {'Retry-After': '900'});
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json')
      return reply(415, {ok: false});
    let fields;
    try {
      const body = await request.text();
      if (Buffer.byteLength(body) > maxBody) return reply(413, {ok: false});
      fields = JSON.parse(body);
    } catch { return reply(400, {ok: false}); }
    if (!fields || typeof fields !== 'object' || Array.isArray(fields)) return reply(400, {ok: false});
    const {name, email, message, website, language} = fields;
    if (typeof name !== 'string' || !name.trim() || name.length > 100 || /[\r\n]/.test(name) ||
        !validEmail(email) || typeof message !== 'string' || !message.trim() || message.length > 5000 ||
        (website !== undefined && typeof website !== 'string') || !['id', 'en'].includes(language))
      return reply(400, {ok: false});
    // The invisible trap never belongs to a legitimate visitor's message.
    if (website) return reply(200, {ok: true});
    const text = `Name: ${name.trim()}\nEmail: ${email}\nLanguage: ${language}\n\n${message.trim()}`;
    try {
      let response;
      if (config.provider === 'mailgun') {
        const body = new URLSearchParams({
          from: `NurHabib Portfolio <${config.sender}>`, to: config.recipient,
          subject: 'Portfolio contact', text, 'h:Reply-To': email,
          'o:tracking': 'no', 'o:tracking-clicks': 'no', 'o:tracking-opens': 'no'
        });
        response = await transport(`https://${config.region === 'eu' ? 'api.eu.mailgun.net' : 'api.mailgun.net'}/v3/${config.domain}/messages`, {
          method: 'POST', headers: {Authorization: `Basic ${Buffer.from(`api:${config.key}`).toString('base64')}`},
          body, signal: AbortSignal.timeout(10000)
        });
      } else {
        response = await transport('https://api.brevo.com/v3/smtp/email', {
          method: 'POST', headers: {'api-key': config.key, 'Content-Type': 'application/json', Accept: 'application/json'},
          body: JSON.stringify({
            sender: {name: 'NurHabib Portfolio', email: config.sender},
            to: [{email: config.recipient}], replyTo: {name: name.trim(), email},
            subject: 'Portfolio contact', textContent: text
          }), signal: AbortSignal.timeout(10000)
        });
      }
      if (!response.ok) {
        log('Contact email provider rejected the request:', response.status);
        return reply(502, {ok: false});
      }
      const result = await response.json();
      const identifier = config.provider === 'mailgun' ? result?.id : result?.messageId;
      if (typeof identifier !== 'string' || !identifier) return reply(502, {ok: false});
      return reply(200, {ok: true});
    } catch {
      // Do not log submitted content, provider responses, or credentials.
      log('Contact email provider request failed');
      return reply(502, {ok: false});
    }
  };
}
