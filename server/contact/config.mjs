const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
export const validEmail = (value) => typeof value === 'string' && value.length <= 254 && emailPattern.test(value);

export function readConfig(env = process.env) {
  const provider = env.CONTACT_EMAIL_PROVIDER || 'mailgun';
  if (!['mailgun', 'brevo'].includes(provider)) throw new Error('Unsupported CONTACT_EMAIL_PROVIDER');
  const region = env.MAILGUN_REGION || 'us';
  if (!['us', 'eu'].includes(region)) throw new Error('MAILGUN_REGION must be us or eu');
  const origins = new Set((env.CONTACT_ALLOWED_ORIGINS || 'https://nurhabibassolihudin.github.io')
    .split(',').map((value) => value.trim()).filter(Boolean));
  for (const origin of origins) {
    const url = new URL(origin);
    if (url.origin !== origin || !['https:', 'http:'].includes(url.protocol)) throw new Error('Origins must be exact HTTP(S) origins');
  }
  const recipient = env.CONTACT_TO || 'nurhabibassolihudin12@gmail.com';
  const sender = env.CONTACT_FROM || '';
  if (!validEmail(recipient) || (sender && !validEmail(sender))) throw new Error('Invalid server mail address');
  const domain = env.MAILGUN_DOMAIN || '';
  if (domain && !/^[a-z\d](?:[a-z\d.-]*[a-z\d])?$/i.test(domain)) throw new Error('Invalid MAILGUN_DOMAIN');
  const key = (provider === 'mailgun' ? env.MAILGUN_SENDING_KEY : env.BREVO_API_KEY) || '';
  return {
    provider, region, origins, recipient, sender, domain, key,
    ready: Boolean(sender && key && (provider !== 'mailgun' || domain)),
    trustProxy: env.CONTACT_TRUST_PROXY === 'true'
  };
}
