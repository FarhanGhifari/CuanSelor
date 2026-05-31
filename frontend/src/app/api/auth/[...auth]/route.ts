import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const backendAuthURL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:8000";

type RouteContext = {
  params: Promise<{ auth: string[] }> | { auth: string[] };
};

const FORWARDED_HEADERS = [
  "accept",
  "authorization",
  "content-type",
  "cookie",
  "origin",
  "referer",
  "user-agent",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-proto",
];

function getForwardedHeaders(req: NextRequest) {
  const headers = new Headers();

  for (const header of FORWARDED_HEADERS) {
    const value = req.headers.get(header);
    if (value) headers.set(header, value);
  }

  return headers;
}

function normalizeSetCookieHeaders(response: Response, headers: Headers) {
  const cookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [];

  if (cookies.length === 0) return;

  headers.delete("set-cookie");

  for (const cookie of cookies) {
    const normalized = cookie.replace(/;\s*Domain=[^;]*/gi, "");
    headers.append("set-cookie", normalized);
  }
}

async function proxyAuthRequest(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  const url = new URL(req.url);
  const target = new URL(`/api/auth/${params.auth.join("/")}${url.search}`, backendAuthURL);
  const headers = getForwardedHeaders(req);
  const hasBody = req.method !== "GET" && req.method !== "HEAD";

  const response = await fetch(target, {
    method: req.method,
    headers,
    body: hasBody ? await req.arrayBuffer() : undefined,
    redirect: "manual",
  });

  const responseHeaders = new Headers(response.headers);
  normalizeSetCookieHeaders(response, responseHeaders);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxyAuthRequest;
export const POST = proxyAuthRequest;
