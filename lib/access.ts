import { timingSafeEqual } from "node:crypto";

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function getAccessConfig() {
  const pin = process.env.ANNIVERSARY_PIN?.trim();

  if (!pin) return null;
  return { pin };
}

export function isAccessConfigured() {
  return getAccessConfig() !== null;
}

export function verifyPin(submittedPin: string) {
  const config = getAccessConfig();
  return config ? safeEqual(submittedPin.trim(), config.pin) : false;
}
