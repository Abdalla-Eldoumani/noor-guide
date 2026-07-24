#!/usr/bin/env node
// Renders every route under every locale and fails on text whose script
// disagrees with the locale. Static analysis catches strings that were never
// extracted; this catches strings that were extracted but read from the wrong
// field, which no linter can see.

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const ARABIC = /[؀-ۿ]/;
const LATIN = /[A-Za-z]{2,}/;

const allowlist = JSON.parse(
  readFileSync(new URL("./i18n-allowlist.json", import.meta.url), "utf8"),
);

const OFFENDING = { ar: LATIN, fr: ARABIC };

function allowed(locale, text) {
  if (/^[\s\d\p{P}\p{S}]*$/u.test(text)) return true;
  return (allowlist[locale] ?? []).some((entry) =>
    entry.endsWith("*") ? text.startsWith(entry.slice(0, -1)) : entry === text,
  );
}

function textNodes(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .split(/<[^>]+>/)
    .map((chunk) =>
      chunk
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#x27;|&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
}

export async function scan(baseUrl, routes, locales = ["ar", "fr"]) {
  const failures = [];
  for (const locale of locales) {
    for (const route of routes) {
      const url = `${baseUrl}/${locale}${route === "/" ? "" : route}`;
      let html;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          failures.push({ url, reason: `HTTP ${res.status}` });
          continue;
        }
        html = await res.text();
      } catch (error) {
        failures.push({ url, reason: error.message });
        continue;
      }
      for (const text of new Set(textNodes(html))) {
        if (OFFENDING[locale].test(text) && !allowed(locale, text)) {
          failures.push({ url, text });
        }
      }
    }
  }
  return failures;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [baseUrl, ...routes] = process.argv.slice(2);
  if (!baseUrl || routes.length === 0) {
    console.error("usage: LOCALES=ar,fr verify-locales.mjs <baseUrl> <route...>");
    process.exit(2);
  }
  const locales = (process.env.LOCALES ?? "ar,fr").split(",").filter(Boolean);
  const failures = await scan(baseUrl, routes, locales);
  let current = "";
  for (const failure of failures) {
    if (failure.url !== current) {
      current = failure.url;
      console.error(`\n${current}`);
    }
    console.error(`   ${(failure.reason ?? failure.text).slice(0, 120)}`);
  }
  console.error(`\n${failures.length} locale violations`);
  process.exit(failures.length ? 1 : 0);
}
