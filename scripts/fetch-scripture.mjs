#!/usr/bin/env node
// Writes the Quran text for every cited passage into src/data/content/*.json
// from a published edition in each locale: Uthmani, Saheeh International,
// Hamidullah. It fetches; it never translates. That is what lets the content
// claim `translation_provenance: "fetched"` truthfully.
//
//   node scripts/fetch-scripture.mjs --check    report differences, write nothing
//   node scripts/fetch-scripture.mjs            write the files and the manifest
//
// It also writes src/data/scripture-manifest.json, recording the ayah count and
// a hash of the Arabic per passage so a reviewer can see at a glance whether a
// passage changed.
//
// Two things this deliberately does not do:
//
// Hadith is not fetched. An earlier version pulled hadith from the Encyclopedia
// of Translated Prophetic Hadiths keyed by an id map. That map is now a
// verification record (src/data/hadith-mapping.json) carrying no encyclopedia
// ids, so the loop had nothing to key on and failed on every entry, including
// the record's own `_readme`. Hadith Arabic is read from the collection by hand
// and recorded there instead.
//
// A passage is not narrowed. If the reference names a range, the whole range is
// written in all three locales. Storing a clause of the Arabic beside a
// full-range translation is how the two came to describe different passages.

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import path from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const CONTENT = path.join(ROOT, "src", "data", "content");
const MANIFEST = path.join(ROOT, "src", "data", "scripture-manifest.json");
const CHECK = process.argv.includes("--check") || process.argv.includes("--dry-run");

const EDITIONS = { ar: "quran-uthmani", en: "en.sahih", fr: "fr.hamidullah" };

// The field each locale lives in. These nodes predate the suffixed convention,
// so English is the bare name.
const FIELDS = { ar: "arabic", en: "translation", fr: "translation_fr" };

const ARABIC = /[؀-ۿ]/;
const sha256 = (value) => createHash("sha256").update(value, "utf8").digest("hex");

// The Uthmani edition carries the basmalah on the opening ayah of every surah
// but al-Fatihah and at-Tawbah, where it is not part of the ayah. Matched
// without diacritics because the edition's vowel marks are not stable enough to
// compare against a literal.
const BASMALAH =
  /^[^\s]*ب[^\s]*س[^\s]*م[^\s]*\s+[^\s]*ل[^\s]*ل[^\s]*ه[^\s]*\s+[^\s]*ر[^\s]*ح[^\s]*م[^\s]*ن[^\s]*\s+[^\s]*ر[^\s]*ح[^\s]*ي[^\s]*م[^\s]*\s+/u;

async function getJson(url) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { accept: "application/json" } });
      if (response.ok) return await response.json();
    } catch {
      // fall through to the retry
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
  }
  throw new Error(`could not fetch ${url}`);
}

// Accepts "2:255", "112:1-4", "Quran 18:23-24".
export function parseReference(reference) {
  const match = String(reference).replace(/^Quran\s+/i, "").match(/^(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) return null;
  const [, surah, from, to] = match;
  return { surah: Number(surah), from: Number(from), to: Number(to ?? from) };
}

export function canonicalise(reference) {
  const parsed = parseReference(reference);
  if (!parsed) return null;
  const range = parsed.to > parsed.from ? `${parsed.from}-${parsed.to}` : `${parsed.from}`;
  return `Quran ${parsed.surah}:${range}`;
}

async function fetchAyah(surah, ayah) {
  const payload = await getJson(
    `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/${Object.values(EDITIONS).join(",")}`,
  );
  const byIdentifier = Object.fromEntries(
    payload.data.map((entry) => [entry.edition.identifier, entry.text]),
  );
  const verse = {};
  for (const [locale, identifier] of Object.entries(EDITIONS)) {
    const text = byIdentifier[identifier];
    if (!text || !text.trim()) throw new Error(`missing ${identifier} for ${surah}:${ayah}`);
    verse[locale] = text.trim();
  }
  if (ayah === 1 && surah !== 1 && surah !== 9) {
    verse.ar = verse.ar.replace(BASMALAH, "").trim();
  }
  if (!ARABIC.test(verse.ar)) throw new Error(`${surah}:${ayah} arabic is not arabic`);
  if (ARABIC.test(verse.fr)) throw new Error(`${surah}:${ayah} french contains arabic`);
  return verse;
}

export async function fetchQuranRange(reference) {
  const parsed = parseReference(reference);
  if (!parsed) throw new Error(`unrecognised quran reference: ${reference}`);
  const parts = { ar: [], en: [], fr: [] };
  for (let ayah = parsed.from; ayah <= parsed.to; ayah += 1) {
    const verse = await fetchAyah(parsed.surah, ayah);
    for (const locale of Object.keys(parts)) parts[locale].push(verse[locale]);
  }
  return {
    ar: parts.ar.join(" ۝ "),
    en: parts.en.join(" "),
    fr: parts.fr.join(" "),
    ayahCount: parsed.to - parsed.from + 1,
  };
}

// Every node carrying a parseable `reference` alongside stored scripture text
// counts. Keying on `type === "quran"` missed nine passages, which is why their
// English stayed a paraphrase while their French was a published edition.
function eachQuranNode(data, visit) {
  (function walk(node) {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== "object") return;
    const hasText = FIELDS.ar in node || FIELDS.en in node;
    if (hasText && typeof node.reference === "string" && parseReference(node.reference)) {
      visit(node);
    }
    Object.values(node).forEach(walk);
  })(data);
}

async function main() {
  const manifest = { quran: {} };
  const problems = [];
  const cache = new Map();
  let changed = 0;
  let unchanged = 0;

  for (const file of readdirSync(CONTENT).filter((f) => f.endsWith(".json"))) {
    const full = path.join(CONTENT, file);
    const data = JSON.parse(readFileSync(full, "utf8"));
    let touched = false;
    const nodes = [];
    eachQuranNode(data, (node) => nodes.push(node));

    for (const node of nodes) {
      const canonical = canonicalise(node.reference);
      if (node.reference !== canonical) {
        console.log(`${file}: reference ${node.reference} -> ${canonical}`);
        changed += 1;
        touched = true;
        if (!CHECK) node.reference = canonical;
      }

      let verse = cache.get(canonical);
      if (!verse) {
        try {
          verse = await fetchQuranRange(canonical);
          cache.set(canonical, verse);
        } catch (error) {
          problems.push(`${canonical}: ${error.message}`);
          continue;
        }
      }

      manifest.quran[canonical] = {
        ayahCount: verse.ayahCount,
        sha256: sha256(verse.ar),
        editions: EDITIONS,
      };

      for (const [locale, field] of Object.entries(FIELDS)) {
        if (node[field] === verse[locale]) {
          unchanged += 1;
          continue;
        }
        changed += 1;
        touched = true;
        if (CHECK) {
          console.log(
            `${file} ${canonical} ${field}\n` +
              `  stored: ${String(node[field] ?? "(none)").slice(0, 88)}\n` +
              `  ${EDITIONS[locale]}: ${verse[locale].slice(0, 88)}`,
          );
        } else {
          node[field] = verse[locale];
        }
      }
      if (!CHECK) node.translation_provenance = "fetched";
    }

    if (touched && !CHECK) {
      writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    }
  }

  if (!CHECK) {
    mkdirSync(path.dirname(MANIFEST), { recursive: true });
    writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  }

  for (const problem of problems) console.error(problem);
  console.error(
    `\n${Object.keys(manifest.quran).length} passages, ` +
      `${changed} fields ${CHECK ? "differ from" : "written from"} the published editions, ` +
      `${unchanged} already matched`,
  );
  console.error(`${problems.length} unresolved`);
  return problems.length;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit((await main()) ? 1 : 0);
}
