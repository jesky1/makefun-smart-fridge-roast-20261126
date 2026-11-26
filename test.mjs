// test.mjs — checks for the smart-fridge roast entry writer.
// Run: node --test test.mjs
import test from "node:test";
import { strict as assert } from "node:assert";
import { execFileSync as runFile } from "node:child_process";
import { mkdtempSync as makeTemp, readFileSync as readText, rmSync as removeTree } from "node:fs";
import { tmpdir as tempRoot } from "node:os";
import { join as joinPath } from "node:path";

// Builds the entry once into a fresh temp folder and returns the text.
function roastOnce() {
  const folder = makeTemp(joinPath(tempRoot(), "fridge-roast-kiencx-"));
  runFile(process.execPath, ["main.ts"], {
    cwd: import.meta.dirname,
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: folder },
    encoding: "utf8",
  });
  const text = readText(joinPath(folder, "entry.txt"), "utf8");
  removeTree(folder, { recursive: true, force: true });
  return text;
}

test("roast fits the gate: 1–160 characters, a single non-blank line", () => {
  const text = roastOnce();
  assert.ok(text.length >= 1, "empty entry");
  assert.ok(text.length <= 160, `too long: ${text.length}`);
  assert.ok(text.trim().length > 0, "blank entry");
  assert.ok(text.indexOf("\n") === -1, "must be one line");
});

test("the roast is identical on every build", () => {
  assert.equal(roastOnce(), roastOnce());
});

test("the roast names the smart fridge, the freezer lock and the security incident", () => {
  const text = roastOnce();
  assert.match(text, /smart fridge/);
  assert.match(text, /locked the freezer/);
  assert.match(text, /security incident/);
  assert.match(text, /2 a\.m\. ice cream/);
});
