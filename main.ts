Deno.serve(async (req: Request) => {
  const url = new URL(req.url);

  // Если запрос идет по пути /openai/..., пересылаем в OpenAI, иначе — в Google Gemini
  if (url.pathname.startsWith("/openai")) {
    url.hostname = "://openai.com";
    url.pathname = url.pathname.replace(/^\/openai/, "");
  } else {
    url.hostname = "://googleapis.com";
  }

  url.protocol = "https:";
  url.port = "";

  const headers = new Headers(req.headers);
  headers.set("Host", url.hostname);

  return fetch(url.toString(), {
    method: req.method,
    headers,
    body: req.body,
  });
});