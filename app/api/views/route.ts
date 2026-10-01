import { NextResponse } from "next/server";

// Profile views are stored in Abacus (free, no account needed).
// Dev and production use separate keys so local testing never inflates the real count.
const NAMESPACE = "paarthasri-portfolio";
const KEY = process.env.NODE_ENV === "production" ? "profile-views" : "profile-views-dev";
const BASE = "https://abacus.jasoncameron.dev";

async function read(path: "get" | "hit") {
  const res = await fetch(`${BASE}/${path}/${NAMESPACE}/${KEY}`, { cache: "no-store" });
  if (res.status === 404 && path === "get") return 0; // key not created yet
  if (!res.ok) throw new Error(`counter ${res.status}`);
  const data = (await res.json()) as { value?: number };
  return typeof data.value === "number" ? data.value : 0;
}

export async function GET() {
  try {
    return NextResponse.json({ views: await read("get") });
  } catch {
    return NextResponse.json({ views: null }, { status: 503 });
  }
}

// Called once per browser, so the number approximates unique visitors.
export async function POST() {
  try {
    return NextResponse.json({ views: await read("hit") });
  } catch {
    return NextResponse.json({ views: null }, { status: 503 });
  }
}
