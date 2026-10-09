# Noor Guide

Noor (نور) means "light" in Arabic. Noor Guide is a free website for new Muslims and for anyone learning about Islam: first lessons in belief, purification, prayer, the short surahs and daily supplications, taken in order and at your own pace.

There is no account, no payment and no advertising. It runs in English, Arabic and French.

Live site: https://noor-guide-dusky.vercel.app

## What is in it

Nine parts, meant to be read in order:

1. **What Muslims believe.** The six articles of faith, with the Quran passages and hadith they rest on.
2. **The five pillars of Islam.** Shahada, prayer, zakat, fasting and hajj, with links to the parts that go deeper.
3. **Wudu.** A step-by-step guide to ablution, what is obligatory and what is recommended, what breaks it, and the du'a after it.
4. **Salah.** The five daily prayers and their rakaat, every position and recitation of one rakah, the tashahhud, the salawat and the tasleem, then the conditions, pillars, required duties, recommended acts, the prostration of forgetfulness and what invalidates the prayer.
5. **Essential surahs.** Al-Fatiha, Al-Ikhlas, Al-Falaq, An-Nas, Al-Kawthar and Al-Asr, verse by verse, with recitation audio by Mishary Alafasy and a memorisation panel.
6. **Daily du'as.** For waking, sleeping, eating, leaving the house and entering the mosque, and for forgiveness and distress.
7. **Purity beyond wudu.** When ghusl is required and how to do it, tayammum, and menstruation and postnatal bleeding.
8. **Prayer in practice.** When each prayer's time begins and ends, a prayer you missed, praying while travelling, and Friday prayer.
9. **When a Muslim dies.** The moment of death, washing and shrouding, the funeral prayer, and burial.

There is also a glossary of 23 terms and 13 everyday phrases.

## Tools

- **Prayer times** for your location from the AlAdhan API, with five calculation methods to choose from.
- **Qibla direction**, worked out on the device from your coordinates and measured from true north.
- **Find a mosque**, which opens Google Maps or OpenStreetMap at your location.

Your location stays in your browser. It is rounded to two decimals (about a kilometre) before it is saved or sent; only those rounded coordinates go to api.aladhan.com, and to the map site if you open one.

## Progress

Progress is kept in the browser's `localStorage`: the parts you have finished, the part you are on, the day you started and how many days in a row you have studied. Nothing leaves the browser, so progress does not follow you to another device.

## Content

Every piece of religious content comes from the JSON files in `src/data/content/`. Nothing is generated at runtime. The loader in `src/lib/content.ts` filters every list on `verified === true`, so an unreviewed item never renders.

- **Quran.** The eight passages cited in the lessons use the Uthmani text from AlQuran Cloud; the six surahs use the simple (imla'i) script from quran.com. English meanings are Saheeh International and French meanings are Muhammad Hamidullah, and the page names the translation wherever it shows one. `npm run fetch:scripture` writes the cited passages from those editions.
- **Hadith.** Each one names its collection and number. The English and French renderings of hadith, du'as and the words said in prayer are the project's own and are marked `translation_provenance: "project"`; the site labels them as its own translation.
- **Citations.** Every citation has an entry in `src/data/hadith-mapping.json` recording the narrator, the wording confirmed, the grading and the source checked. `npm run verify:citations` fails the build if a citation has no entry or an entry is no longer cited.

The content follows Sunni Islam (Ahl as-Sunnah wal-Jama'ah).

### Scholarly review

The 114 rulings in the wudu, salah, purity, prayer-in-practice and janazah lists carry `needs_scholarly_review: true` until a qualified reviewer signs them off, and none has been signed off yet. The schools of Islamic law differ on some of these acts and on how they are grouped and counted. Each of those lessons says so at the top, and the salah lesson names the Hanbali arrangement it follows. Grep for `needs_scholarly_review` for the full list.

## Languages

English is served at `/`, Arabic at `/ar` and French at `/fr`, through `next-intl` with `localePrefix: "as-needed"`. The language menu keeps you on the same page, and next-intl remembers the choice in its `NEXT_LOCALE` cookie.

Interface text lives in `messages/{en,ar,fr}.json`; lesson text lives beside the content as `_ar` and `_fr` fields. `npm run verify:i18n` runs before every build and fails on a missing, empty or untranslated key, or a content field without all three languages. `scripts/verify-locales.mjs` scans rendered pages for text in the wrong script. On `/ar` the transliteration and translations are hidden, since an Arabic reader has the source.

See `docs/I18N.md` for the details and for adding a fourth language.

## Design

The site is set like a small first-lessons book: one column, rules instead of cards, and a contents page for the path. Literata sets headings and lesson text, IBM Plex Sans sets labels and controls, Amiri sets the Quran and Arabic display text, and Noto Naskh Arabic sets the Arabic interface. Colours follow the reader's light or dark system setting. There are no photographs; the only ornament is a girih star band on the home page.

## Tech stack

- Next.js 16.4.0 (App Router, Turbopack), every page prerendered
- React 19.3.0, TypeScript 5.9.3
- Tailwind CSS 4.3.3, configured in CSS (`src/styles/globals.css`)
- next-intl 4.14.9
- lucide-react 0.400.0 for a few interface icons
- AlAdhan API for prayer times and AlQuran Cloud for recitation audio, both free and keyless
- Deployed on Vercel

Dependencies are pinned to exact versions.

## Running locally

```bash
git clone https://github.com/Abdalla-Eldoumani/noor-guide.git
cd noor-guide
npm ci
npm run dev
```

Then open `http://localhost:3000`. Arabic is at `/ar`, French at `/fr`.

Before opening a pull request:

```bash
npm run lint
npm run type-check
npm run build          # runs verify:i18n and verify:citations first
```

To scan rendered pages for text in the wrong language, start a server and pass it the routes:

```bash
LOCALES=ar,fr node scripts/verify-locales.mjs http://localhost:3000 / /learn /learn/salah /tools
```

## Deploying

Import the repository into Vercel and deploy; there are no keys to configure. `NEXT_PUBLIC_SITE_URL` overrides the site address used in metadata, the sitemap, robots.txt and structured data, which otherwise defaults to the live host above.

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/learn` | The path, with your progress |
| `/learn/aqeedah` | What Muslims believe |
| `/learn/pillars` | The five pillars |
| `/learn/wudu` | Wudu |
| `/learn/salah` | Salah |
| `/learn/surahs` | Essential surahs, with audio |
| `/learn/duas` | Daily du'as |
| `/learn/taharah` | Purity beyond wudu |
| `/learn/prayer-practice` | Prayer in practice |
| `/learn/janazah` | When a Muslim dies |
| `/learn/glossary` | Terms and phrases |
| `/tools` | Tools |
| `/tools/prayer-times` | Prayer times |
| `/tools/qibla` | Qibla direction |
| `/tools/masjid-finder` | Find a mosque |
| `/progress` | Your progress |

Every route also exists under `/ar` and `/fr`.

## Project structure

```
src/
├── app/[locale]/        # pages; lesson pages render on the server
├── components/
│   ├── layout/          # Header, Footer, MobileNav, Breadcrumb, LocaleSwitcher
│   ├── learn/           # LessonContent, StepByStep, RulingList, SurahPlayer, PathContents
│   ├── tools/           # LocationPicker, LocationBar, PrayerTimesDisplay, QiblaCompass
│   ├── seo/             # JSON-LD helpers
│   └── ui/              # ArabicText, Button, Glyphs, SourceReference, StatusMark
├── config/              # prayer calculation methods
├── data/                # religious content (content/*.json) and the citation record
├── hooks/               # useLocalStorage, useProgress, useSettings, usePrayerTimes
├── lib/                 # content loader, site URL, prayer times, qibla, storage
├── styles/              # globals.css: colour tokens, type scale, dark values
└── types/

scripts/
├── verify-i18n.mjs      # locale parity, gates the build
├── verify-citations.mjs # every citation has a verification entry, gates the build
├── verify-locales.mjs   # render-time locale scan
├── fetch-scripture.mjs  # writes the cited Quran passages from published editions
└── i18n-allowlist.json  # reviewable exceptions for the verifiers
```

## License

[MIT](LICENSE)
