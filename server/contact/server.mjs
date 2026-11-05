import {createServer} from 'node:http';
import {readConfig} from './config.mjs';
import {createContactHandler} from './handler.mjs';

const config = readConfig();
const handle = createContactHandler(config);
const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || '127.0.0.1';
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
const server = createServer(async (incoming, outgoing) => {
  try {
    const chunks = [];
    let size = 0;
    for await (const chunk of incoming) {
      size += chunk.length;
      if (size > 16 * 1024) {
        outgoing.writeHead(413, {'Content-Type': 'application/json', 'Cache-Control': 'no-store'});
        outgoing.end('{"ok":false}');
        return;
      }
      chunks.push(chunk);
    }
    const method = incoming.method || 'GET';
    const request = new Request(new URL(incoming.url || '/', 'http://contact.internal'), {
      method, headers: incoming.headers,
      ...(!['GET', 'HEAD'].includes(method) ? {body: Buffer.concat(chunks)} : {})
    });
    const forwarded = incoming.headers['x-forwarded-for'];
    const address = config.trustProxy && typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim() : incoming.socket.remoteAddress || 'unknown';
    const response = await handle(request, address);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    if (!outgoing.headersSent) outgoing.writeHead(400, {'Content-Type': 'application/json', 'Cache-Control': 'no-store'});
    outgoing.end('{"ok":false}');
  }
});
server.requestTimeout = 20000;
server.headersTimeout = 10000;
server.listen(port, host, () => console.log(`Contact service listening on ${host}:${port}; mail configured: ${config.ready}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
