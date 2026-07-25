#!/usr/bin/env node
// Static parity checks across message catalogues and content data.
// Runs without a server, so it gates the build; verify-locales.mjs covers the
// cases that only appear once a page is rendered.

import { readFileSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const LOCALES = ["en", "ar", "fr"];
const ARABIC = /[؀-ۿ]/;

const allowlist = JSON.parse(
  readFileSync(new URL("./i18n-allowlist.json", import.meta.url), "utf8"),
);
const sameAsEnglishOk = new Set(allowlist.sameAsEnglish ?? []);

const failures = [];
const fail = (message) => failures.push(message);

function flatten(value, prefix = "") {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([key, inner]) =>
      flatten(inner, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [[prefix, value]];
}

const placeholders = (value) =>
  Array.isArray(value)
    ? ""
    : [...String(value).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");

// --- messages ---------------------------------------------------------------

const catalogues = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    Object.fromEntries(
      flatten(
        JSON.parse(readFileSync(path.join(ROOT, "messages", `${locale}.json`), "utf8")),
      ),
    ),
  ]),
);

const englishKeys = Object.keys(catalogues.en);

for (const locale of LOCALES) {
  const keys = Object.keys(catalogues[locale]);
  for (const key of englishKeys) {
    if (!(key in catalogues[locale])) fail(`messages/${locale}.json is missing "${key}"`);
  }
  for (const key of keys) {
    if (!(key in catalogues.en)) fail(`messages/${locale}.json has extra key "${key}"`);
  }
}

for (const key of englishKeys) {
  const en = catalogues.en[key];
  for (const locale of LOCALES) {
    const value = catalogues[locale][key];
    if (value === undefined) continue;

    if (typeof value === "string" && value.trim() === "") {
      fail(`messages/${locale}.json has an empty value for "${key}"`);
    }
    if (placeholders(en) !== placeholders(value)) {
      fail(
        `messages/${locale}.json placeholder mismatch for "${key}": ` +
          `expected {${placeholders(en)}}, got {${placeholders(value)}}`,
      );
    }
    if (locale === "en") continue;

    if (typeof value === "string" && value === en && !sameAsEnglishOk.has(key)) {
      fail(`messages/${locale}.json repeats the English value for "${key}"`);
    }
    if (locale === "ar" && typeof value === "string" && !ARABIC.test(value)
        && !(allowlist.ar ?? []).includes(value)) {
      fail(`messages/ar.json has no Arabic characters for "${key}": "${value}"`);
    }
    if (locale === "fr" && typeof value === "string" && ARABIC.test(value)
        && !(allowlist.fr ?? []).includes(value)) {
      fail(`messages/fr.json contains Arabic characters for "${key}": "${value}"`);
    }
  }
}

// --- content data -----------------------------------------------------------
// Every field carrying an `_en` sibling must also carry `_ar` and `_fr`.
// Fields listed in `contentExempt` are religious-source text that is presented
// in the original rather than retranslated.

const exempt = new Set(allowlist.contentExempt ?? []);
const contentDir = path.join(ROOT, "src", "data", "content");

function walkContent(node, file, trail = "") {
  if (Array.isArray(node)) {
    node.forEach((item, index) => walkContent(item, file, `${trail}[${index}]`));
    return;
  }
  if (!node || typeof node !== "object") return;

  // A field is translatable if it carries an `_en` sibling (suffixed style) or
  // an `_ar` sibling (bare-named style). Both must reach every locale.
  const bases = new Set();
  for (const key of Object.keys(node)) {
    if (key.endsWith("_en") || key.endsWith("_ar")) bases.add(key.slice(0, -3));
  }

  for (const base of bases) {
    if (exempt.has(base)) continue;
    const hasSource = `${base}_en` in node || base in node;
    if (!hasSource) continue;
    for (const locale of ["ar", "fr"]) {
      const sibling = `${base}_${locale}`;
      const value = node[sibling];
      if (value === undefined || value === null || String(value).trim() === "") {
        fail(`${file}: ${trail}.${base} is missing "${sibling}"`);
      }
    }
  }

  for (const key of Object.keys(node)) {
    walkContent(node[key], file, `${trail}.${key}`);
  }
}

for (const file of readdirSync(contentDir).filter((f) => f.endsWith(".json"))) {
  walkContent(
    JSON.parse(readFileSync(path.join(contentDir, file), "utf8")),
    `src/data/content/${file}`,
  );
}

// --- report -----------------------------------------------------------------

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const message of failures) console.error(message);
  console.error(`\n${failures.length} i18n violations`);
  process.exit(failures.length ? 1 : 0);
}
