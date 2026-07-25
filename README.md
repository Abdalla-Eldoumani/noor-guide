# Noor Guide

Noor (نور) means "light" in Arabic. This is a free web app that helps new Muslims learn the basics of their faith, from beliefs to prayer to daily supplications, at their own pace.

No sign-ups. No payments. No ads. Just open it and start learning.

Available in English, Arabic, and French.

## Who is this for?

- Someone who just took their Shahada and doesn't know where to start
- Someone curious about Islam who wants to understand the fundamentals
- A born Muslim looking to revisit the basics

## What you can learn

The app is organized into six modules, meant to be taken in order:

**1. Aqeedah (Beliefs).** The six pillars of Iman: belief in Allah, the Angels, the Books, the Prophets, the Day of Judgment, and Divine Decree. Each pillar includes Quran references and relevant hadith.

**2. Five Pillars of Islam.** An overview of Shahada, Salah, Zakah, Sawm, and Hajj. Links out to the detailed modules for prayer and other practices.

**3. Wudu (Ablution).** A 10-step interactive guide to washing before prayer, based on Quran 5:6 and authentic Sunnah. Also sets out the three groupings a beginner needs in order to know whether their wudu counts: what is obligatory (fard), what is recommended (sunnah), and what nullifies it. Includes the dua to say after.

**4. Salah (Prayer).** The most detailed module. Covers all five daily prayers, the number of rakaat for each, and walks through every position and recitation in a single rakah: standing, bowing, prostrating, sitting. Includes Tashahhud, Salawat Ibrahimiyyah, and Tasleem. It then separates the prayer into its pillars (arkan), its required duties (wajibat), and its recommended acts (sunan), so a reader who is told that Al-Fatiha is a pillar can see what that means and what the other pillars are. It also covers the prostration of forgetfulness for when you make a mistake, and what invalidates the prayer outright.

**5. Essential Surahs.** The short surahs you need for prayer: Al-Fatiha, Al-Ikhlas, Al-Falaq, An-Nas, Al-Kawthar, and Al-Asr. Each has the Arabic text with full tashkeel, transliteration, English translation, and audio recitation by Mishary Alafasy (fetched from the Al Quran Cloud API). You can play individual verses or the entire surah.

**6. Daily Duas.** Supplications for waking up, sleeping, eating, leaving the house, entering the mosque, and more. All with Arabic, transliteration, translation, and source references.

There's also a **glossary** with 23 Islamic terms and 13 common Arabic phrases, explained in whichever language you are reading in.

## Tools

- **Prayer Times.** Enter your location and get accurate prayer times using the AlAdhan API. Supports multiple calculation methods (ISNA, MWL, Umm Al-Qura, Egyptian).
- **Qibla Finder.** Uses your device's GPS to calculate the direction of the Kaaba from wherever you are. Pure math, no API needed.
- **Mosque Finder.** Helps you locate nearby mosques using map search.

## Progress tracking

Your progress is saved in your browser's `localStorage`. Mark lessons as complete, and the app tracks what you've finished, shows progress bars per module, and picks up where you left off. No account needed; the trade-off is that progress lives on the specific browser you used.

## Design

The app uses a warm, calming color palette:

- Deep forest green (`#2D6A4F`) as the primary color
- Warm gold (`#D4A574`) as an accent
- Cream background (`#FEFCF3`)

Three font families: Plus Jakarta Sans for headings, Inter for body text, and Amiri for Arabic script. All Arabic text renders right-to-left at a minimum of 24px for readability.

Dark mode is supported and respects your system preference.

No photos of people or faces anywhere. The app uses geometric patterns and abstract elements only, following Islamic guidelines.

## Content integrity

This is the most important part of the project. Every piece of religious content comes from pre-verified JSON files in `src/data/content/`. Nothing is generated on the fly. Every Quran verse, hadith, dua, and instruction has a source reference (Quran chapter:verse, Sahih Bukhari number, Sahih Muslim number, etc.). Any content item that hasn't been verified is automatically filtered out and never rendered.

The content follows Sunni Islam (Ahl as-Sunnah wal-Jamaa'ah). Where differences exist between madhabs, the most common position is presented with a note that variations exist.

## Languages

The site runs in English (`/`), Arabic (`/ar`), and French (`/fr`), powered by `next-intl`
with `localePrefix: "as-needed"`. The language switcher preserves your current page and
writes the choice to `localStorage`, so return visits land on the right prefix.

Every user-visible string reaches all three languages: navigation, lesson prose, step
instructions, glossary definitions, tooltips, error messages, page titles, and the
accessibility skip link. This is enforced, not just intended. `npm run verify:i18n` fails
the build on any key that is missing, empty, or left as English in another catalogue, and
`npm run verify:locales` renders every page in every language and reports any text whose
script disagrees with the page.

Scripture is handled differently from prose. The project never retranslates Quran or hadith.
Quran text is Uthmani in Arabic, Saheeh International in English, and Hamidullah in French.
The French for the six essential surahs is the published Hamidullah edition, fetched rather
than translated.
Hadith text in all three languages is pulled from a single Encyclopedia of Translated
Prophetic Hadiths entry, so the three languages carry the same meaning by construction
rather than by review. `npm run fetch:scripture` populates it.

One gap is open: `src/data/hadith-mapping.json` maps each cited hadith to its encyclopedia
id, and it is not yet filled in. Until it is, hadith quotations render in the English
translation the project authors selected, with the citation and grading localized. The
mapping is deliberately left for a human to complete rather than guessed.

## Scholarly review

The pillars, required duties, recommended acts, and nullifiers carry
`needs_scholarly_review: true` in the content files. The acts themselves are agreed across
the Sunni schools, but the way they are grouped and counted is not: the app follows the
Hanbali arrangement because it separates the three tiers most clearly for a beginner, and
says so in the lesson. A qualified reviewer should sign these off before the app is used in
a classroom. Grep for `needs_scholarly_review` to get the full list.

Transliteration and English back-translation are hidden on the Arabic locale, since a
reader of the Arabic source does not need either.

French follows the transliteration conventions used in French-speaking madrassahs
(Abou Bakr, Aïcha, wudû', chahâda) so the text reads correctly aloud.

See `docs/I18N.md` for how the pieces fit together and how to add a fourth language.

## Tech stack

- Next.js 16.2.4 with App Router and Turbopack (static site generation, locale routing)
- React 19.2.5, TypeScript 5.9.3
- Tailwind CSS 4.2.4 with class-based dark mode (`@theme` CSS-first config)
- `next-intl` 4.11.0 for routing and message dictionaries
- `lucide-react` 0.400.0 for icons
- `localStorage` (no database, no backend)
- AlAdhan API for prayer times (free, no key required)
- Al Quran Cloud API for Quran audio (free, no key required)
- Deployed on Vercel

All dependencies are pinned to exact versions in `package.json`.

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
npm run verify:i18n   # locale parity; also runs automatically before build
npm run lint
npm run type-check
npm run build
```

To check for language leaking across locales, start the dev server and run:

```bash
LOCALES=ar,fr node scripts/verify-locales.mjs http://localhost:3000 / /learn /tools
```

## Deploying

Push to GitHub, import into Vercel, and deploy. No environment variables or API keys to configure. The optional `NEXT_PUBLIC_SITE_URL` env variable is read by `sitemap.ts` and `robots.ts` if you want canonical URLs.

## Routes

| Path | Page |
|------|------|
| `/` | Landing page |
| `/learn` | Learning dashboard |
| `/learn/aqeedah` | Beliefs and creed |
| `/learn/pillars` | Five Pillars overview |
| `/learn/wudu` | Ablution guide |
| `/learn/salah` | Prayer guide |
| `/learn/surahs` | Essential surahs with audio |
| `/learn/duas` | Daily supplications |
| `/learn/glossary` | Islamic terms and phrases |
| `/tools` | Tools index |
| `/tools/prayer-times` | Prayer times by location |
| `/tools/qibla` | Qibla direction |
| `/tools/masjid-finder` | Mosque locator |
| `/progress` | Your learning progress |

Every route exists in all three languages: `/learn/salah`, `/ar/learn/salah`, `/fr/learn/salah`.

## Project structure

```
src/
├── app/                 # All pages and routes
├── components/
│   ├── ui/              # Button, Card, ProgressBar, ArabicText, AudioPlayer, RecitationBlockquote, StarOctagram, Modal
│   ├── layout/          # Header, Footer, MobileNav, Breadcrumb, PageWrapper
│   ├── learn/           # LessonContent, StepByStep, SurahPlayer, QuranVerse, HadithBlock
│   └── tools/           # LocationPicker, PrayerTimesDisplay, QiblaCompass, MasjidCard
├── config/              # PRAYER_METHODS and other configuration constants
├── data/content/        # 9 verified JSON files with all Islamic content (read-only)
├── hooks/               # useProgress, useSettings, useLocalStorage, usePrayerTimes
├── lib/                 # content.ts, storage.ts, prayer-times.ts, quran-api.ts, qibla.ts, progress.ts
├── styles/              # globals.css with Tailwind layers and a print stylesheet
└── types/               # TypeScript interfaces for content and API responses

scripts/
├── verify-i18n.mjs      # static locale parity, gates the build
├── verify-locales.mjs   # render-time locale scan
├── fetch-scripture.mjs  # pulls Quran and hadith in all three languages
└── i18n-allowlist.json  # reviewable exceptions for both verifiers
```

## License

[MIT](LICENSE)
