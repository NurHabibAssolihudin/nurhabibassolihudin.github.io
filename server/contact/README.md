# Contact delivery on your server

The portfolio remains static on GitHub Pages. This small Node 24 service is deployed separately on your server and sends messages through your existing Mailgun or Brevo account. There is no new form-service account, database, or npm dependency.

The public browser endpoint is `POST /api/contact`. It accepts JSON with `name`, `email`, `message`, `language` (`en` or `id`), and optional `website` (empty honeypot). It returns `{ "ok": true }` only when the configured provider accepts a legitimate message and returns its message ID. This means queued/accepted, not confirmed inbox delivery. No visitor receives an automatic email.

## Configure and run

From the repository root:

```powershell
Copy-Item server/contact/.env.example server/contact/.env
# Edit server/contact/.env on the server. Never commit the filled file.
node --env-file=server/contact/.env server/contact/server.mjs
```

For Linux, the same Node command works; use `cp` to create the environment file. Run it under your existing process manager, or use Docker:

```sh
docker build -t portfolio-contact server/contact
docker run -d --name portfolio-contact --restart unless-stopped \
  --env-file server/contact/.env -e HOST=0.0.0.0 \
  -p 127.0.0.1:8787:8787 portfolio-contact
```

The explicit host override lets the process listen inside its container while the published port stays bound to the server's loopback interface. The Dockerfile and command have not been validated by a Docker build in this task.

Mailgun: use a verified sending domain, a sender on that domain, and a **Domain Sending Key**, not the primary account key. Choose `us` or `eu` to match the domain's Mailgun region. For a sandbox domain, Mailgun's authorized-recipient restrictions still apply.

Brevo: set `CONTACT_EMAIL_PROVIDER=brevo`, supply `BREVO_API_KEY`, and use an approved sender in `CONTACT_FROM`. Mailgun settings are then unused. The recipient is fixed by `CONTACT_TO`; request bodies cannot choose a recipient, sender, or arbitrary provider URL. Visitor email is used only as Reply-To and inside the plain-text message.

Keep the service bound to loopback behind your existing HTTPS reverse proxy. Example Caddy configuration:

```caddyfile
cns.ocaty.com {
    reverse_proxy 127.0.0.1:8787
}
```

Point `cns.ocaty.com` to your server. It did not resolve from the development environment on 5 November 2026; DNS and TLS are part of the owner's manual installation. Set `CONTACT_ALLOWED_ORIGINS` to a comma-separated list of exact portfolio origins. If enabling `CONTACT_TRUST_PROXY`, ensure the service is unreachable directly and the trusted proxy overwrites client-supplied `X-Forwarded-For`; otherwise leave it false (all visitors may share the proxy's rate bucket). CORS controls browser access, not authentication or bot prevention.

Local testing can add `http://127.0.0.1:4173` to allowed origins. `GET /health` reports 503 until credentials and sender are present. It never returns a key. Do not test a real send until you intend to send an email to the configured inbox.

## Connect GitHub Pages

Set the repository **Actions variable** `PUBLIC_CONTACT_ENDPOINT` to `https://cns.ocaty.com/api/contact` under Settings → Secrets and variables → Actions → Variables, then rebuild the site. The existing Pages workflow passes only this public URL into Astro. Keep Mailgun/Brevo credentials exclusively on your server; do not put them in `PUBLIC_*`, Astro build output, or this public repository.

For local preview, set that variable before `npm run build`. With no endpoint configured, the form honestly displays an unavailable state and keeps the existing email link available. Without JavaScript, the email fallback remains; the submit control stays disabled rather than navigating visitors to a JSON endpoint.

The sender enforces JSON, bounded body/field sizes, exact allowed origins, a hidden trap, five attempts per IP per 15 minutes, and 100 attempts overall per 15 minutes. Counters are bounded, in memory, and reset on restart; use one instance or add shared rate limiting at your reverse proxy if scaling. It logs provider status codes without message bodies or credentials. It does not provide a distributed spam-defense guarantee. No automatic retry is performed after an uncertain network result.

## References

- [Mailgun key management](https://documentation.mailgun.com/docs/mailgun/user-manual/api-key-mgmt/rbac-mgmt)
- [Mailgun sending endpoint](https://documentation.mailgun.com/docs/mailgun/api-reference/send/mailgun/messages/post-v3--domain-name--messages)
- [Brevo transactional API](https://developers.brevo.com/docs/send-a-transactional-email)
- [GitHub Pages static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

Verification must distinguish mocked provider acceptance, a live API request, actual inbox receipt, and production deployment. None implies the next.
