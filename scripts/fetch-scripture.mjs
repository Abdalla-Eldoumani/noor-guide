#!/usr/bin/env node
// Fetches Quran and hadith text in all three locales from verified sources and
// writes them into src/data/content/*.json.
//
// Nothing here translates anything. Quran French is the Hamidullah edition,
// Quran English is Saheeh International, and hadith text in all three languages
// comes from a single Encyclopedia of Translated Prophetic Hadiths entry, so the
// three locales carry the same meaning by construction rather than by review.
//
//   node scripts/fetch-scripture.mjs --dry-run    report what would change
//   node scripts/fetch-scripture.mjs              write the files
//
// Requires outbound network. Run it where that is available, then commit the
// resulting data and manifest together.

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const CONTENT = path.join(ROOT, "src", "data", "content");
const MANIFEST = path.join(ROOT, "src", "data", "scripture-manifest.json");
const DRY_RUN = process.argv.includes("--dry-run");

const QURAN_EDITIONS = {
  ar: "quran-uthmani",
  en: "en.sahih",
  fr: "fr.hamidullah",
};

const ARABIC = /[؀-ۿ]/;
const sha256 = (value) => createHash("sha256").update(value, "utf8").digest("hex");

async function getJson(url) {
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.json();
}

// --- Quran ------------------------------------------------------------------

// Accepts "2:255", "112:1-4", "18:23-24".
function parseReference(reference) {
  const match = reference.replace(/^Quran\s+/i, "").match(/^(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) return null;
  const [, surah, from, to] = match;
  return { surah: Number(surah), from: Number(from), to: Number(to ?? from) };
}

async function fetchAyah(surah, ayah) {
  const editions = Object.values(QURAN_EDITIONS).join(",");
  const payload = await getJson(
    `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/${editions}`,
  );
  const byIdentifier = Object.fromEntries(
    payload.data.map((entry) => [entry.edition.identifier, entry.text]),
  );
  const result = {};
  for (const [locale, identifier] of Object.entries(QURAN_EDITIONS)) {
    const text = byIdentifier[identifier];
    if (!text || !text.trim()) {
      throw new Error(`missing ${identifier} for ${surah}:${ayah}`);
    }
    result[locale] = text.trim();
  }
  if (!ARABIC.test(result.ar)) throw new Error(`${surah}:${ayah} arabic is not arabic`);
  if (ARABIC.test(result.fr)) throw new Error(`${surah}:${ayah} french contains arabic`);
  return result;
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
    ar: parts.ar.join(" "),
    en: parts.en.join(" "),
    fr: parts.fr.join(" "),
    ayahCount: parsed.to - parsed.from + 1,
  };
}

// --- Hadith -----------------------------------------------------------------
// The encyclopedia is keyed by its own ids, not by collection and number, so the
// mapping is checked in and reviewable rather than guessed at fetch time. An
// unmapped hadith is reported, never silently left partly translated.

const MAPPING_PATH = path.join(ROOT, "src", "data", "hadith-mapping.json");

export async function fetchHadith(hadeethencId) {
  const locales = ["ar", "en", "fr"];
  const responses = await Promise.all(
    locales.map((locale) =>
      getJson(
        `https://hadeethenc.com/api/v1/hadeeths/one/?language=${locale}&id=${hadeethencId}`,
      ),
    ),
  );
  const text = {};
  const grade = {};
  responses.forEach((payload, index) => {
    const locale = locales[index];
    if (!payload?.hadeeth?.trim()) throw new Error(`hadith ${hadeethencId}: empty ${locale}`);
    text[locale] = payload.hadeeth.trim();
    grade[locale] = (payload.grade ?? "").trim();
  });
  if (!ARABIC.test(text.ar)) throw new Error(`hadith ${hadeethencId} arabic is not arabic`);
  return { text, grade };
}

// --- Driver -----------------------------------------------------------------

function collectQuranReferences() {
  const found = new Map();
  for (const file of readdirSync(CONTENT).filter((f) => f.endsWith(".json"))) {
    const data = JSON.parse(readFileSync(path.join(CONTENT, file), "utf8"));
    (function walk(node) {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== "object") return;
      if (node.type === "quran" && typeof node.reference === "string") {
        found.set(node.reference, file);
      }
      Object.values(node).forEach(walk);
    })(data);
  }
  return found;
}

async function main() {
  const manifest = { quran: {}, hadith: {} };
  const problems = [];

  for (const [reference] of collectQuranReferences()) {
    try {
      const verse = await fetchQuranRange(reference);
      manifest.quran[reference] = {
        ayahCount: verse.ayahCount,
        sha256: sha256(verse.ar),
        editions: QURAN_EDITIONS,
      };
      console.log(`quran ${reference}: ${verse.ayahCount} ayah, all three locales`);
    } catch (error) {
      problems.push(`quran ${reference}: ${error.message}`);
    }
  }

  let mapping = {};
  try {
    mapping = JSON.parse(readFileSync(MAPPING_PATH, "utf8"));
  } catch {
    problems.push(
      `no ${path.relative(ROOT, MAPPING_PATH)}; every hadith needs a reviewed ` +
        `collection-to-encyclopedia id mapping before it can be fetched`,
    );
  }

  for (const [reference, hadeethencId] of Object.entries(mapping)) {
    if (hadeethencId == null) {
      problems.push(`hadith ${reference}: unmapped, needs a human to identify the entry`);
      continue;
    }
    try {
      const hadith = await fetchHadith(hadeethencId);
      manifest.hadith[reference] = {
        hadeethencId,
        sha256: sha256(hadith.text.ar),
        grades: hadith.grade,
      };
      console.log(`hadith ${reference} -> ${hadeethencId}: all three locales`);
    } catch (error) {
      problems.push(`hadith ${reference}: ${error.message}`);
    }
  }

  if (!DRY_RUN) {
    mkdirSync(path.dirname(MANIFEST), { recursive: true });
    writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  }

  for (const problem of problems) console.error(problem);
  console.error(`\n${problems.length} unresolved`);
  process.exit(problems.length ? 1 : 0);
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  await main();
}
