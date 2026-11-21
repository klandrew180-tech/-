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

  const cleanHeaders = new Headers();
  const allowed = ['content-type', 'authorization', 'x-goog-api-key', 'x-goog-api-client', 'accept'];
  for (const [k, v] of req.headers.entries()) {
    if (allowed.includes(k.toLowerCase())) {
      cleanHeaders.set(k, v);
    }
  }

  return fetch(url.toString(), {
    method: req.method,
    headers: cleanHeaders,
    body: req.method === 'GET' || req.method === 'HEAD' ? null : req.body,
  });
}