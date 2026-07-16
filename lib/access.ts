import { createHmac, timingSafeEqual } from "node:crypto";

export const ACCESS_COOKIE_NAME = "anniversary_access";
const TOKEN_PURPOSE = "anniversary-access-v1";

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function getAccessConfig() {
  const pin = process.env.ANNIVERSARY_PIN?.trim();
  const secret = process.env.ANNIVERSARY_SECRET?.trim();

  if (!pin || !secret) return null;
  return { pin, secret };
}

export function isAccessConfigured() {
  return getAccessConfig() !== null;
}

export function verifyPin(submittedPin: string) {
  const config = getAccessConfig();
  return config ? safeEqual(submittedPin.trim(), config.pin) : false;
}

export function createAccessToken() {
  const config = getAccessConfig();
  if (!config) throw new Error("Anniversary access is not configured.");

  return createHmac("sha256", config.secret)
    .update(`${TOKEN_PURPOSE}:${config.pin}`)
    .digest("base64url");
}

export function verifyAccessToken(token?: string) {
  if (!token) return false;

  const config = getAccessConfig();
  if (!config) return false;

  const expected = createHmac("sha256", config.secret)
    .update(`${TOKEN_PURPOSE}:${config.pin}`)
    .digest("base64url");

  return safeEqual(token, expected);
}
