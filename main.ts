// main.ts — Roast the Smart Fridge: One Line, Best Laugh Wins entry writer.
// Writes one original roast line to /output/entry.txt.
import { mkdirSync as makeDir, writeFileSync as writeFile } from "node:fs";

// The roast, written fresh in this session: my smart fridge treats a
// 2 a.m. ice cream run as a security threat and locks the freezer over it.
export const ROAST =
  "My smart fridge locked the freezer for 'suspicious snacking' — apparently my 2 a.m. ice cream counts as a security incident.";

// The gate in the rules: entry.txt is UTF-8 text, 1–160 characters,
// one line, never just whitespace.
const MIN_LEN = 1;
const MAX_LEN = 160;
const FILENAME = "entry.txt";

function checkRoast(line: string): void {
  // Length first: the gate is a hard 1–160 characters, so a line
  // outside it is rejected before anything else is looked at.
  if (line.length < MIN_LEN || line.length > MAX_LEN) {
    throw new Error(`roast is ${line.length} chars, gate is ${MIN_LEN}-${MAX_LEN}`);
  }
  if (line.trim() === "") {
    throw new Error("roast is blank");
  }
  if (line !== line.trim()) {
    throw new Error("roast must not start or end with whitespace");
  }
  if (!/fridge/i.test(line)) {
    throw new Error("roast must name the fridge");
  }
  if (line.indexOf("\n") !== -1 || line.indexOf("\r") !== -1) {
    throw new Error("roast must be one line");
  }
}

checkRoast(ROAST);
const outFolder = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
makeDir(outFolder, { recursive: true });
writeFile(outFolder + "/" + FILENAME, ROAST, "utf8");
console.log(`roast saved: ${ROAST.length} characters to ${outFolder}/${FILENAME}`);
