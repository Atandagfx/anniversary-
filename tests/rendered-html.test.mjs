import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete anniversary story", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Happy One-Year Anniversary, My Love/);
  assert.match(html, /Relive Our Story/);
  assert.match(html, /A letter for you/);
  assert.match(html, /Reasons I love you/);
  assert.match(html, /One Last Thing/);
  assert.match(html, /Made with love, just for you/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});
