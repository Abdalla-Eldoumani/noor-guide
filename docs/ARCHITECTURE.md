# Architecture

This document describes how Noor Guide is built and how the moving parts fit together. It is meant for someone who has cloned the repo and wants a mental model before reading the code.

## High level

Noor Guide is a static Next.js site. There is no backend. Every page renders to HTML at build time and hydrates with React on the client for interactivity. The Next.js App Router lives under `src/app/`, and every route is a file or directory there. State that needs to survive a refresh lives in the user's browser via `localStorage`. External calls happen at runtime in the user's browser (AlAdhan for prayer times, Al Quran Cloud for surah audio); the build itself never touches a network beyond the public package registry.

## The data layer

All Islamic content lives as JSON in `src/data/content/`. There are nine files there: `aqeedah.json`, `pillars.json`, `wudu-steps.json`, `salah-steps.json`, `surahs.json`, `duas-daily.json`, `arabic-phrases.json`, `glossary.json`, and `learning-path.json`. They are the single source of truth for every Quran verse, hadith, dua, and instruction the app displays. None of them are generated. None are produced by AI. They were authored and reviewed against authentic sources by the project's authors.

Every accessor in `src/lib/content.ts` is a thin function that loads the JSON, filters by `verified === true`, and returns a typed result. That filter is the safety net. It exists so an item that has not been reviewed cannot accidentally render to a user. The repository convention is that AI agents do not edit `src/data/content/*.json`; if an issue is discovered, the human authors patch it. The convention is enforced by repository rules, not by tooling, but the `verified` filter at the gateway means that even if unverified data slipped into a JSON file, it would not reach a user.

Because every page calls into the same gateway, adding a new piece of pre-verified religious content is a two-step process: (1) the human authors add the item to the relevant JSON file with `"verified": true` and a `source` reference, and (2) if the item belongs to a new lesson type, an accessor in `src/lib/content.ts` and a route under `src/app/learn/` are added to render it. Step 1 is exclusive to humans; step 2 can be assisted by an agent.

## Routes and rendering

The route structure is flat. Top-level routes are `/`, `/learn`, `/learn/<module>`, `/learn/glossary`, `/tools`, `/tools/<tool>`, and `/progress`. Each route is a server component by default. Anything that needs hooks or browser APIs (audio, geolocation, theme detection, `localStorage`) is split into a sibling client component and imported. The convention is `page.tsx` (server) plus an optional `<Module>Client.tsx` (client) inside the same folder.

Pages are pre-rendered at build time. The build emits 17 static HTML files, one per route, with hashed JS bundles for the interactive parts. There is no on-demand server rendering; every visit is served from the CDN. This means anything that requires the user's local context (their location for prayer times, their `localStorage` progress) happens after hydration on the client.

## Browser persistence

Three keys exist in `localStorage`:

- **`noor-settings`** holds the user's theme, locale, prayer-time calculation method, and last-known location. Read and written through `useSettings`.
- **`noor-progress`** holds completed lessons, the current lesson, day streak, and the timestamp of the last activity. Read through `useProgress` and `src/lib/progress.ts`.
- **`noor-bookmarks`** is an array of content ids the user has bookmarked.

The streak math in `src/lib/progress.ts` is bucketed by local-midnight day boundaries. When a lesson completes, the prior `lastActiveAt` is captured before being overwritten, and `computeStreak` compares the local day of the prior timestamp with the local day of now. Same local day means no change; one day forward means +1; anything else resets to 1. Local-midnight bucketing is what lets a session at 23:55 followed by 00:05 the next day count as a +1 streak instead of being missed because the wall-clock difference was only ten minutes.

Theme flash is prevented by a tiny inline script in `src/app/layout.tsx` that runs before React hydrates. It reads `noor-settings.theme` from `localStorage` and adds the `dark` class to `<html>` if needed. After hydration, the `ThemeSync` client component keeps the class in step with settings.

## i18n

Translation files exist at `messages/en.json` and `messages/ar.json` in the repository root. They were authored by hand, not machine-translated. Wiring them through `next-intl` with a `/ar/*` route prefix is planned but not yet implemented in this codebase; the relevant phase requires a package install that is currently deferred. When the wiring lands, the site's URL structure will become `/` for English and `/ar` for Arabic, with the active locale persisted in `noor-settings.language`.

The educational instructional prose embedded in the JSON content files (the `description_en`, `instruction_en`, `content_en`, `key_points`, and `notes` fields) is intentionally not retranslated as part of any locale pass. Religious content (Quran translations, hadith translations, dua translations) is also not retranslated, since those came in pre-verified. See `docs/I18N.md` for the full localization plan.

## Design system

The visual language sits in `tailwind.config.js` and `src/styles/globals.css`. Colors live in `tailwind.config.js` as a `primary` ramp (forest greens 50-900), an `accent` ramp (warm golds 50-700), `cream`, `surface`, `ink`, and `muted`. Fonts are loaded via `next/font/google` in `src/app/layout.tsx`: Plus Jakarta Sans for headings, Inter for body, Amiri for Arabic, JetBrains Mono for transliterations. Custom Arabic font sizes (`text-arabic-sm` through `text-arabic-xl`) ensure Quranic text never renders below 24px.

`globals.css` adds a few component classes that compose Tailwind utilities: `.card`, `.source-ref`, `.arabic-text`, `.arabic-text-lg`, `.transliteration`, and the four `.step-circle*` variants. Two utility classes (`scrollbar-hide` and `min-arabic-size`) round out the file. A `@media print` block at the bottom hides navigation chrome, expands link targets, and applies page-break hints so a lesson printed to paper still reads cleanly.

Two conventional UI patterns exist that lessons compose against. `<RecitationBlockquote>` (in `src/components/ui/`) wraps a recitation in an indented blockquote with a gold leading rule; it replaces an older flat-fill callout pattern. `<StarOctagram>` is a small Rub el-Hizb (eight-point star) component used as an authored geometric mark on the 404 page and available for any future quiet decorative role.

Dark mode is class-based (`darkMode: "class"` in `tailwind.config.js`). The `dark` class on `<html>` is set by the inline script described above. Components opt in with `dark:*` modifiers on the relevant utilities.

## Adding a new component

Place generic UI primitives under `src/components/ui/`. Place layout chrome under `src/components/layout/`. Place lesson UI under `src/components/learn/`. Place tool UI under `src/components/tools/`. Server components are the default; only add `"use client"` if the component needs `useState`, `useEffect`, browser APIs, or interactive event handlers. Use the existing typography classes (`font-heading`, `font-body`, `font-arabic`), the existing color tokens, and `dark:*` variants for every text-on-background combination. Avoid em dashes anywhere in code, comments, copy, or commit messages.

## Adding a new content item

Religious content additions are exclusive to the human authors. The flow is: (1) edit the relevant file under `src/data/content/`, (2) add the `source` reference (Quran chapter:verse or hadith collection + number), (3) include `arabic_text` and `transliteration` where applicable, and (4) set `"verified": true`. Items missing `verified: true` are filtered out at the gateway in `src/lib/content.ts` and never render. If a new lesson type is needed, add a new accessor to `src/lib/content.ts` and a route under `src/app/learn/`; both can be done by an agent once the JSON shape is settled.

## External APIs

Two free public APIs are called from the browser. `src/lib/prayer-times.ts` wraps the AlAdhan endpoint at `api.aladhan.com/v1/timings/<DD-MM-YYYY>`, caching the result in `localStorage` per day-location-method tuple. `src/lib/quran-api.ts` wraps `api.alquran.cloud/v1/surah/<n>/ar.alafasy` for audio URLs, also cached per surah. Both fall back to stale cache on network failure. Neither requires an API key.

## Build and verification

`npm run dev` runs the development server. `npm run build` produces the static export. `npm run type-check` runs `tsc --noEmit`. `ANALYZE=true npm run build` produces a bundle analyzer report via `@next/bundle-analyzer`. The default function timeout assumed by Vercel does not apply because every route is static.
