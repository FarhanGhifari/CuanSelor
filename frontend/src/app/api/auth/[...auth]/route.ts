import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const backendAuthURL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:8000";

type RouteContext = {
  params: Promise<{ auth: string[] }> | { auth: string[] };
};

async function proxyAuthRequest(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  const url = new URL(req.url);
  const target = new URL(`/api/auth/${params.auth.join("/")}${url.search}`, backendAuthURL);
  const headers = new Headers(req.headers);
  const hasBody = req.method !== "GET" && req.method !== "HEAD";

  headers.delete("host");

  return fetch(target, {
    method: req.method,
    headers,
    body: hasBody ? await req.arrayBuffer() : undefined,
    redirect: "manual",
  });
}

export const GET = proxyAuthRequest;
export const POST = proxyAuthRequest;
