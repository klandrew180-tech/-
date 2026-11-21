export default async function handler(req, res) {
  const url = new URL(req.url, 'https://googleapis.com');

  if (url.pathname.startsWith('/openai')) {
    url.hostname = '://openai.com';
    url.pathname = url.pathname.replace(/^\/openai/, '');
  } else {
    url.hostname = '://googleapis.com';
  }

  const headers = {};
  const allowed = ['content-type', 'authorization', 'x-goog-api-key', 'x-goog-api-client', 'accept'];
  for (const [k, v] of Object.entries(req.headers)) {
    if (allowed.includes(k.toLowerCase())) {
      headers[k] = v;
    }
  }

  const fetchOptions = {
    method: req.method,
    headers,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  const response = await fetch(url.toString(), fetchOptions);
  res.status(response.status);
  response.headers.forEach((value, key) => {
    if (!['content-encoding', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
      res.setHeader(key, value);
    }
  });

  const text = await response.text();
  res.send(text);
}