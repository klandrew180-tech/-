export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);

  if (url.pathname.startsWith('/openai')) {
    url.hostname = '://openai.com';
    url.pathname = url.pathname.replace(/^\/openai/, '');
  } else {
    url.hostname = '://googleapis.com';
  }

  url.protocol = 'https:';
  url.port = '';

  const headers = new Headers(req.headers);
  headers.set('Host', url.hostname);
  headers.delete('x-forwarded-for');
  headers.delete('x-real-ip');

  return fetch(url.toString(), {
    method: req.method,
    headers,
    body: req.body,
  });
}