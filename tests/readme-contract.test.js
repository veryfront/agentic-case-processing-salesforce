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

test("documents local setup and eval commands", () => {
  const local = section("## Getting started");
  const evaluation = section("## Eval");

  assert.match(local, /npm i\n/);
  assert.match(local, /npm run dev/);
  assert.match(evaluation, /npm run eval/);
});

test("documents Cloud deployment and the template fork link", () => {
  const cloud = section("## Deploy to Veryfront Cloud");

  assert.match(cloud, /npm run deploy/);
  assert.match(cloud, /Fork this template in \[Veryfront Studio\]\(https:\/\/new\.veryfront\.com\/\?template=agentic-case-processing-salesforce&agent=case-triage\)\./);
});
