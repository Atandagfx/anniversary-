import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the PIN gate protects every fresh page load", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const gate = await readFile(new URL("../components/PinGate.tsx", import.meta.url), "utf8");
  const route = await readFile(new URL("../app/api/unlock/route.ts", import.meta.url), "utf8");

  assert.match(page, /<PinGate content=\{anniversaryContent\}/);
  assert.doesNotMatch(page, /cookies\(|verifyAccessToken|ACCESS_COOKIE_NAME/);
  assert.match(gate, /setIsUnlocked\(true\)/);
  assert.doesNotMatch(gate, /localStorage|sessionStorage|window\.location\.reload/);
  assert.doesNotMatch(route, /cookies\.set|set-cookie|maxAge|ACCESS_COOKIE_NAME/i);
});

test("the client story includes interactive chapters, four videos, and the love transition", async () => {
  const source = await readFile(
    new URL("../components/AnniversarySite.tsx", import.meta.url),
    "utf8",
  );
  const relationship = await readFile(
    new URL("../data/relationship.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /Page navigation/);
  assert.match(source, /showLoveTransition/);
  assert.match(source, /muslim-couple-kiss\.webp/);
  assert.equal((relationship.match(/src: "\/videos\/memory-0[1-4]\.mp4"/g) ?? []).length, 4);
});
