import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const API_URL = process.env.LANGGRAPH_API_URL;
const API_KEY = process.env.LANGSMITH_API_KEY ?? "";

const STRIPPED_RESPONSE_HEADERS = new Set([
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "connection",
]);

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Expose-Headers": "content-location",
  };
}

async function handleRequest(req: NextRequest, method: string) {
  if (!API_URL) {
    return NextResponse.json({ error: "LANGGRAPH_API_URL is not set" }, { status: 500 });
  }

  const path = req.nextUrl.pathname.replace(/^\/?api\//, "");
  const searchParams = new URLSearchParams(req.nextUrl.search);
  searchParams.delete("_path");
  searchParams.delete("nxtP_path");
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";

  const forwardedHeaders: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    if (key.toLowerCase().startsWith("x-") || key.toLowerCase() === "authorization") {
      forwardedHeaders[key] = value;
    }
  });

  const init: RequestInit = {
    method,
    headers: { ...forwardedHeaders, "x-api-key": API_KEY },
  };
  if (["POST", "PUT", "PATCH"].includes(method)) {
    init.body = await req.text();
  }

  const upstream = await fetch(`${API_URL}/${path}${queryString}`, init);

  const responseHeaders: Record<string, string> = {};
  upstream.headers.forEach((value, key) => {
    if (!STRIPPED_RESPONSE_HEADERS.has(key.toLowerCase())) {
      responseHeaders[key] = value;
    }
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: { ...responseHeaders, ...corsHeaders() },
  });
}

export const GET = (req: NextRequest) => handleRequest(req, "GET");
export const POST = (req: NextRequest) => handleRequest(req, "POST");
export const PUT = (req: NextRequest) => handleRequest(req, "PUT");
export const PATCH = (req: NextRequest) => handleRequest(req, "PATCH");
export const DELETE = (req: NextRequest) => handleRequest(req, "DELETE");
export const OPTIONS = () => new NextResponse(null, { status: 204, headers: corsHeaders() });
