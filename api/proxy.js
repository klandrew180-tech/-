export default async function handler(req, res) {
  const incomingUrl = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  let targetHost = '://googleapis.com';
  let targetPath = incomingUrl.pathname;

  if (targetPath.startsWith('/openai')) {
    targetHost = '://openai.com';
    targetPath = targetPath.replace(/^\/openai/, '') || '/';
  }

  const targetUrl = `https://${targetHost}${targetPath}${incomingUrl.search}`;

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

  const response = await fetch(targetUrl, fetchOptions);
  res.status(response.status);
  response.headers.forEach((value, key) => {
    if (!['content-encoding', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
      res.setHeader(key, value);
    }
  });

  const text = await response.text();
  res.send(text);
}