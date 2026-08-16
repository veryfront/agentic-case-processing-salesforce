import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

function section(heading) {
  const start = readme.indexOf(heading);
  assert.notEqual(start, -1, `Missing ${heading}`);
  const next = readme.indexOf("\n## ", start + heading.length);
  return readme.slice(start, next === -1 ? undefined : next);
}

test("documents an account-free local mock path", () => {
  const local = section("## Run account-free local mock evals");

  assert.match(local, /ANTHROPIC_API_KEY=<API_KEY>/);
  assert.match(local, /npm run eval/);
  assert.match(local, /evals\/mock-tools\.ts/);
  assert.doesNotMatch(local, /npx veryfront login/);
  assert.doesNotMatch(local, /npx veryfront push/);
});

test("states why the live Salesforce app requires a backing service", () => {
  const boundary = section("## Understand the standalone boundary");

  assert.match(boundary, /`salesforce__\*`/);
  assert.match(boundary, /backing API or service layer/);
  assert.match(boundary, /does not make Salesforce\s+requests/);
});
