#!/usr/bin/env node
// Every citation in the content must have an entry in the verification record,
// and every entry must point at content that still exists. This does not prove
// a citation is correct; it proves none is unaccounted for. Correctness comes
// from the cross-checks recorded per entry.

import { readFileSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const CONTENT = path.join(ROOT, "src", "data", "content");
const RECORD = path.join(ROOT, "src", "data", "hadith-mapping.json");

const CONSENSUS = "Scholarly consensus";
const failures = [];

function collectCitations() {
  const found = new Map();
  for (const file of readdirSync(CONTENT).filter((f) => f.endsWith(".json"))) {
    const data = JSON.parse(readFileSync(path.join(CONTENT, file), "utf8"));
    (function walk(node) {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== "object") return;

      let ref = node.type === "hadith" ? node.reference : null;
      if (!ref && typeof node.source === "string" && node.source !== CONSENSUS) {
        ref = node.source;
      }
      if (ref) {
        if (!found.has(ref)) found.set(ref, new Set());
        found.get(ref).add(file);
      }
      Object.values(node).forEach(walk);
    })(data);
  }
  return found;
}

const record = JSON.parse(readFileSync(RECORD, "utf8"));
const entries = record.citations ?? {};
const citations = collectCitations();

if (Object.keys(entries).length === 0) {
  failures.push("hadith-mapping.json has no entries");
}

for (const ref of citations.keys()) {
  if (!(ref in entries)) {
    failures.push(`no verification entry for "${ref}"`);
  }
}

for (const ref of Object.keys(entries)) {
  if (!citations.has(ref)) {
    failures.push(`verification entry for "${ref}" is no longer cited in any content`);
  }
}

for (const [ref, entry] of Object.entries(entries)) {
  if (!["verified", "pending"].includes(entry.status)) {
    failures.push(`"${ref}" has an unrecognised status: ${entry.status}`);
  }
  if (entry.status === "verified" && !entry.checkedAgainst) {
    failures.push(`"${ref}" is marked verified but names no source it was checked against`);
  }
}

const verified = Object.values(entries).filter((e) => e.status === "verified").length;
const total = Object.keys(entries).length;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const failure of failures) console.error(failure);
  console.error(
    `\n${total} citations, ${verified} verified against an independent source, ` +
      `${total - verified} pending`,
  );
  console.error(`${failures.length} citation violations`);
  process.exit(failures.length ? 1 : 0);
}
