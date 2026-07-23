import { NextResponse } from "next/server";
import { isAccessConfigured, verifyPin } from "../../../lib/access";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAccessConfigured()) {
    return NextResponse.json(
      { message: "This anniversary PIN has not been configured yet." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  let pin = "";

  try {
    const body = (await request.json()) as { pin?: unknown };
    pin = typeof body.pin === "string" ? body.pin : "";
  } catch {
    return NextResponse.json(
      { message: "Please enter the PIN and try again." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!verifyPin(pin)) {
    return NextResponse.json(
      { message: "That PIN is not quite right. Try again, my love." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
