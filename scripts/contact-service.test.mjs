import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readConfig} from '../server/contact/config.mjs';
import {createContactHandler} from '../server/contact/handler.mjs';

const origin = 'https://nurhabibassolihudin.github.io';
const config = () => readConfig({
  CONTACT_FROM: 'portfolio@example.com', MAILGUN_DOMAIN: 'mg.example.com',
  MAILGUN_SENDING_KEY: 'test-key-not-a-real-credential'
});
const fields = {name: 'A visitor', email: 'visitor@example.net', message: 'A project to discuss.', website: '', language: 'id'};
const request = (body = fields, headers = {}, method = 'POST') => new Request('https://contact.example.com/api/contact', {
  method, headers: {Origin: origin, 'Content-Type': 'application/json', ...headers},
  ...(!['GET', 'OPTIONS'].includes(method) ? {body: typeof body === 'string' ? body : JSON.stringify(body)} : {})
});
const accepted = async () => Response.json({id: '<queued@example.com>'});
const quiet = () => {};

test('Mailgun sends only to the configured inbox with a verified sender and visitor Reply-To', async () => {
  let outgoing;
  const handle = createContactHandler(config(), {transport: async (url, options) => {
    outgoing = {url, options};
    return accepted();
  }});
  const response = await handle(request({...fields, to: 'unwanted@example.net', from: 'forged@example.net'}), 'visitor-ip');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {ok: true});
  assert.equal(outgoing.url, 'https://api.mailgun.net/v3/mg.example.com/messages');
  assert.equal(outgoing.options.body.get('to'), 'nurhabibassolihudin12@gmail.com');
  assert.equal(outgoing.options.body.get('from'), 'NurHabib Portfolio <portfolio@example.com>');
  assert.equal(outgoing.options.body.get('h:Reply-To'), fields.email);
  assert.equal(outgoing.options.body.get('o:tracking'), 'no');
  assert.ok(outgoing.options.body.get('text').includes(fields.message));
  assert.ok(!JSON.stringify(Object.fromEntries(response.headers)).includes('test-key'));
});

test('EU Mailgun uses its fixed regional API host', async () => {
  const settings = {...config(), region: 'eu'};
  const handle = createContactHandler(settings, {transport: async (url) => {
    assert.equal(url, 'https://api.eu.mailgun.net/v3/mg.example.com/messages');
    return accepted();
  }});
  assert.equal((await handle(request())).status, 200);
});

test('Brevo uses its server API key and fixed recipient without Mailgun credentials', async () => {
  const settings = readConfig({CONTACT_EMAIL_PROVIDER: 'brevo', CONTACT_FROM: 'portfolio@example.com', BREVO_API_KEY: 'fake-brevo-key'});
  const handle = createContactHandler(settings, {transport: async (url, options) => {
    assert.equal(url, 'https://api.brevo.com/v3/smtp/email');
    assert.equal(options.headers['api-key'], 'fake-brevo-key');
    const mail = JSON.parse(options.body);
    assert.equal(mail.to[0].email, settings.recipient);
    assert.equal(mail.replyTo.email, fields.email);
    assert.equal(mail.textContent.includes(fields.message), true);
    return Response.json({messageId: 'brevo-queued-id'}, {status: 201});
  }});
  assert.equal((await handle(request())).status, 200);
});

test('exact origin matching and preflight prevent a foreign website from using browser CORS', async () => {
  const handle = createContactHandler(config(), {transport: accepted});
  const preflight = await handle(request(null, {}, 'OPTIONS'));
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), origin);
  assert.equal((await handle(request(fields, {Origin: origin + '.attacker.example'}))).status, 403);
  assert.equal((await handle(request(fields, {Origin: ''}))).status, 403);
  assert.equal((await handle(request(null, {}, 'GET'))).status, 405);
});

test('invalid, injected, empty, oversized and malformed input never reaches a provider', async () => {
  const cases = [
    {...fields, name: ''}, {...fields, name: 'Name\r\nBcc: forged@example.net'},
    {...fields, email: 'test@example.net\nBcc: forged@example.net'},
    {...fields, message: '   '}, {...fields, message: 'x'.repeat(5001)},
    {...fields, name: 'x'.repeat(101)}, {...fields, language: 'unknown'},
    {...fields, website: {}}, null, [], '{malformed'
  ];
  for (const body of cases) {
    let sent = false;
    const handle = createContactHandler(config(), {transport: async () => {sent = true; return accepted();}});
    assert.equal((await handle(request(body))).status, 400, JSON.stringify(body).slice(0, 80));
    assert.equal(sent, false);
  }
  const handle = createContactHandler(config(), {transport: accepted});
  assert.equal((await handle(request(fields, {'Content-Type': 'text/plain'}))).status, 415);
  assert.equal((await handle(request('x'.repeat(17000)))).status, 413);
});

test('honeypot submissions are acknowledged without sending mail', async () => {
  let sent = false;
  const handle = createContactHandler(config(), {transport: async () => {sent = true; return accepted();}});
  assert.equal((await handle(request({...fields, website: 'bot-filled-field'}))).status, 200);
  assert.equal(sent, false);
});

test('per-IP limits reject repeated sends and expire instead of blocking indefinitely', async () => {
  let time = 0, sent = 0;
  const handle = createContactHandler(config(), {now: () => time, transport: async () => {sent++; return accepted();}});
  for (let i = 0; i < 5; i++) assert.equal((await handle(request(), 'same-ip')).status, 200);
  const limited = await handle(request(), 'same-ip');
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('Retry-After')) > 0);
  assert.equal(sent, 5);
  time += 15 * 60 * 1000;
  assert.equal((await handle(request(), 'same-ip')).status, 200);
});

test('global send ceiling also covers requests spread over different IPs', async () => {
  const handle = createContactHandler(config(), {transport: accepted});
  for (let i = 0; i < 100; i++) assert.equal((await handle(request(), `ip-${i}`)).status, 200);
  assert.equal((await handle(request(), 'another-ip')).status, 429);
});

test('missing configuration reports unavailable and never pretends to send', async () => {
  const handle = createContactHandler(readConfig({}), {transport: () => {throw new Error('must not send');}});
  assert.equal((await handle(request())).status, 503);
  assert.equal((await handle(new Request('https://contact.example.com/health'))).status, 503);
});

test('provider rejection, malformed acceptance and network failure return failure without leaking details', async () => {
  for (const transport of [
    async () => Response.json({message: 'private provider detail'}, {status: 401}),
    async () => Response.json({message: 'no accepted message ID'}),
    async () => new Response('not json'),
    async () => {throw new Error('contains a credential');}
  ]) {
    const response = await createContactHandler(config(), {transport, log: quiet})(request());
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), {ok: false});
  }
});

test('configuration rejects invalid origins, unsupported provider, region and header injection', () => {
  for (const env of [
    {CONTACT_EMAIL_PROVIDER: 'unknown'}, {MAILGUN_REGION: 'unknown'},
    {CONTACT_ALLOWED_ORIGINS: origin + '/path'}, {CONTACT_FROM: 'x@example.net\nBcc: forged@example.net'},
    {MAILGUN_DOMAIN: 'domain/other-path'}
  ]) assert.throws(() => readConfig(env));
});
