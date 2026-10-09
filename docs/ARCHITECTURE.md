# Architecture

How Noor Guide is put together, for someone who has cloned the repository and wants a map before reading the code.

## High level

Noor Guide is a static Next.js site with no backend. Every page is prerendered at build time for each of the three locales (51 pages) and hydrates in the browser where a page needs interaction. The App Router lives under `src/app/`; everything user-facing sits in the `[locale]` segment. What must survive a refresh (progress, settings, bookmarks) is kept in the reader's `localStorage`. The only runtime network calls are made from the browser: AlAdhan for prayer times, and AlQuran Cloud plus cdn.islamic.network for recitation audio, the latter only after the reader presses play.

## The data layer

All religious content is JSON in `src/data/content/`, twelve files: `learning-path.json` (the nine modules, their order and their lesson ids), one file per module (`aqeedah`, `pillars`, `wudu-steps`, `salah-steps`, `surahs`, `duas-daily`, `taharah`, `prayer-practice`, `janazah`), `glossary.json` and `arabic-phrases.json`. They are the single source of every Quran passage, hadith, du'a and instruction on the site.

`src/lib/content.ts` is the only reader. Every list it returns is filtered on `verified === true`, including the sections of the three newer modules, so an item that has not been reviewed cannot render. The file is imported by server code only: pages and server components read from it and hand client components the strings they need as props, which keeps the content JSON out of the browser bundles. `getModuleNav` derives each module's number and its previous and next modules from `learning-path.json`, so a new module is linked in by adding it there.

`src/data/hadith-mapping.json` records, for every citation, the narrator, the wording confirmed, the grading and the source checked. `scripts/verify-citations.mjs` gates the build on it. `src/data/scripture-manifest.json` pins the editions and hashes of the cited Quran passages that `scripts/fetch-scripture.mjs` writes.

## Routes and rendering

Routes are `/`, `/learn`, `/learn/<module>`, `/learn/glossary`, `/tools`, `/tools/<tool>` and `/progress`, each under `/ar` and `/fr` as well. Pages are server components. A lesson page renders the whole lesson on the server and nests the few interactive pieces as client components: `LessonContent` (progress and the mark-as-done button), `StepByStep`, `SurahPlayer`, `MemorizationHelper` and `BookmarkToggle`. The glossary search, the progress page and the three tools are client components fed by a server page that sets the title and metadata.

Unmatched URLs under a locale render the localized not-found view from `src/app/[locale]/[...rest]/page.tsx`. `src/proxy.ts` is the next-intl middleware. The Open Graph card in `src/app/[locale]/opengraph-image.tsx` is rendered by Satori, which lays out with flexbox only and cannot shape Arabic, so every multi-child element sets `display: flex` and the Arabic site uses the English card.

`src/lib/site.ts` holds `SITE_URL` (from `NEXT_PUBLIC_SITE_URL`, defaulting to the live host) and the helpers that build locale-prefixed URLs for metadata, the sitemap, robots.txt and JSON-LD.

## Browser persistence

`src/hooks/useLocalStorage.ts` keeps one store per key behind `useSyncExternalStore`. A write goes to `localStorage` at once (not inside a React state update, so it survives the component unmounting), every component reading the key re-renders, and other tabs pick it up through the `storage` event. Stored values are merged over the defaults, so data from older versions keeps working. If storage is unavailable, values live in memory for the session.

- **`noor-settings`**: the prayer calculation method and the location, rounded to two decimals before it is stored (`useSettings`). Older full-precision values are rounded on first read.
- **`noor-progress`**: completed lesson ids, the module last opened, the start date, the last active time and the day streak (`useProgress`). Opening a module counts as a day of study; `src/lib/progress.ts` buckets days at local midnight.
- **`noor-bookmarks`**: saved du'a ids.
- **`noor-prayer-times-cache`** and **`noor-quran-audio-<n>`**: response caches.

## Prayer times, qibla and the mosque finder

`src/lib/prayer-times.ts` asks `api.aladhan.com/v1/timings/<DD-MM-YYYY>` with rounded coordinates and the chosen method, and caches the day per location and method. If the service cannot be reached, a cached day for the same place is shown and labelled with its date. The next prayer is computed in the location's own time zone, which AlAdhan returns, so typed-in coordinates for another city still mark the right prayer.

`src/lib/qibla.ts` computes the great-circle bearing to the Kaaba on the device; the compass in `QiblaCompass.tsx` is drawn from that bearing and measures from true north. The mosque finder only builds outbound Google Maps and OpenStreetMap links.

## Design system

Everything visual is defined in `src/styles/globals.css`. The `@theme` block clears Tailwind's default palette, type scale, radii and shadows and defines a closed set: colour tokens (`paper`, `wash`, `ink`, `ink-2`, `rule`, `fajr`, `ochre`, `sage`, `clay`), a named type scale (`text-display` down to `text-micro`, plus `text-quran` and `text-arabic`), two radii and one width for the book column. The dark values of the same tokens sit under `@media (prefers-color-scheme: dark)`, so the site follows the reader's system setting with no stored theme and no class toggling.

Fonts load through `next/font/google` in `src/lib/fonts.ts`: Literata (headings and prose, with italic for transliteration), IBM Plex Sans (labels and controls), Amiri (Quran and Arabic display) and Noto Naskh Arabic (the Arabic interface, not preloaded so the other locales skip it). `font-prose` and `font-ui` resolve through `--type-prose` and `--type-ui`, which switch to Noto Naskh Arabic under `:lang(ar)`; `font-quran` is Amiri everywhere.

The hand-drawn glyphs for the modules and tools are in `src/components/ui/Glyphs.tsx`, and the four prayer postures are drawn in `PrayerPosition.tsx`. Motion is limited to colour transitions of 150 ms and the accordion chevron, and stops under `prefers-reduced-motion`.

## Adding a module

1. Add the content JSON under `src/data/content/` with `"verified": true` on every item and a source on every ruling.
2. Add the module to `learning-path.json` with its lesson ids and minutes.
3. Add an accessor to `src/lib/content.ts` and a page under `src/app/[locale]/learn/<id>/`; a module made of an introduction and sections can render through `SectionedLesson`.
4. Add a glyph to `MODULE_GLYPHS` and the route to `src/app/sitemap.ts`.

## Build and verification

- `npm run dev` runs the development server.
- `npm run build` runs `verify:i18n` and `verify:citations`, then prerenders every route in every locale.
- `npm run lint` and `npm run type-check` run ESLint and `tsc --noEmit`.
- `node scripts/fetch-scripture.mjs --check` compares the cited Quran passages with the published editions.
- `ANALYZE=true npm run build` adds a bundle analyzer report.
