// Worst Fix Ever: Funniest Commit Message
// Writes one commit message (<=100 chars) for a bug fix that made
// everything worse, to <output dir>/entry.txt.
//
// The joke: the "fix" for a noisy warning was to delete the very code
// that raised the warning. The bug is gone from the logs because the
// thing that reported it no longer exists — the repair broke the
// reporting instead of the problem.

import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// The entry: one line, a real-looking commit subject, no explanation needed.
const ENTRY =
  "fix: silence noisy warning by deleting the code that warned us";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  // Gate: 1-100 characters, a single non-blank line, no control characters.
  if (ENTRY.length < 1 || ENTRY.length > 100) {
    fail(`entry must be 1-100 characters, got ${ENTRY.length}`);
  }
  if (ENTRY.trim().length === 0) {
    fail("entry must not be blank");
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r") || ENTRY.includes("\t")) {
    fail("entry must be a single line with no newline or tab");
  }
  if (ENTRY !== ENTRY.trim()) {
    fail("entry must not start or end with whitespace");
  }
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(ENTRY)) {
    fail("entry must not contain control characters");
  }

  const outDir =
    process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
  if (outDir === ".") {
    fail('output dir "." is not allowed');
  }
  const dir = resolve(outDir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "entry.txt"), ENTRY, "utf8");
  console.log(`wrote ${ENTRY.length}-character entry to ${join(dir, "entry.txt")}`);
}

main();
