import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectDirectory = fileURLToPath(new URL("..", import.meta.url));
const port = 4100 + (process.pid % 500);
const baseUrl = `http://127.0.0.1:${port}`;
let output = "";

const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(port)],
  {
    cwd: projectDirectory,
    env: {
      ...process.env,
      ANNIVERSARY_PIN: "246810",
      ANNIVERSARY_SECRET: "test-only-secret-that-is-long-enough",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

server.stdout.on("data", (chunk) => { output += chunk; });
server.stderr.on("data", (chunk) => { output += chunk; });

async function waitForServer() {
  const deadline = Date.now() + 20_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Next.js exited early.\n${output}`);

    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  throw new Error(`Next.js did not become ready.\n${output}`);
}

test("the PIN gate protects and unlocks the anniversary story", async () => {
  await waitForServer();

  const lockedResponse = await fetch(baseUrl);
  const lockedHtml = await lockedResponse.text();
  assert.equal(lockedResponse.status, 200);
  assert.match(lockedHtml, /Our story is waiting/);
  assert.doesNotMatch(lockedHtml, /Relive Our Story/);

  const rejectedResponse = await fetch(`${baseUrl}/api/unlock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: "000000" }),
  });
  assert.equal(rejectedResponse.status, 401);
  assert.equal(rejectedResponse.headers.get("set-cookie"), null);

  const unlockResponse = await fetch(`${baseUrl}/api/unlock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: "246810" }),
  });
  assert.equal(unlockResponse.status, 200);

  const cookie = unlockResponse.headers.get("set-cookie")?.split(";", 1)[0];
  assert.ok(cookie?.startsWith("anniversary_access="));

  const unlockedResponse = await fetch(baseUrl, { headers: { cookie } });
  const unlockedHtml = await unlockedResponse.text();
  assert.equal(unlockedResponse.status, 200);
  assert.match(unlockedHtml, /Happy One-Year Anniversary, Ajoke/);
  assert.match(unlockedHtml, /Relive Our Story/);
  assert.match(unlockedHtml, /Open Love letter/);
  assert.match(unlockedHtml, /Open Our story/);
  assert.match(unlockedHtml, /Open Our photos/);
  assert.match(unlockedHtml, /Open Our videos/);
  assert.match(unlockedHtml, /Open Why I love you/);
  assert.match(unlockedHtml, /Open One last thing/);
  assert.match(unlockedHtml, /Page navigation/);
  assert.doesNotMatch(unlockedHtml, /codex-preview|react-loading-skeleton/);
});

test.after(() => {
  server.kill("SIGTERM");
});
