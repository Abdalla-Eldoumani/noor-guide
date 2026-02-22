# Noor Guide

Noor (نور) means "light" in Arabic. This is a free web app that helps new Muslims learn the basics of their faith — from beliefs to prayer to daily supplications — at their own pace.

No sign-ups. No payments. No ads. Just open it and start learning.

## Who is this for?

- Someone who just took their Shahada and doesn't know where to start
- Someone curious about Islam who wants to understand the fundamentals
- A born Muslim looking to revisit the basics

## What you can learn

The app is organized into six modules, meant to be taken in order:

**1. Aqeedah (Beliefs)** — The six pillars of Iman: belief in Allah, the Angels, the Books, the Prophets, the Day of Judgment, and Divine Decree. Each pillar includes Quran references and relevant hadith.

**2. Five Pillars of Islam** — An overview of Shahada, Salah, Zakah, Sawm, and Hajj. Links out to the detailed modules for prayer and other practices.

**3. Wudu (Ablution)** — A 10-step interactive guide to washing before prayer, based on Quran 5:6 and authentic Sunnah. Includes what breaks wudu and the dua to say after.

**4. Salah (Prayer)** — The most detailed module. Covers all five daily prayers, the number of rakaat for each, and walks through every position and recitation in a single rakah — standing, bowing, prostrating, sitting. Includes Tashahhud, Salawat Ibrahimiyyah, and Tasleem.

**5. Essential Surahs** — The short surahs you need for prayer: Al-Fatiha, Al-Ikhlas, Al-Falaq, An-Nas, Al-Kawthar, and Al-Asr. Each one has the Arabic text with full tashkeel, transliteration, English translation, and audio recitation by Mishary Alafasy (fetched from the Al Quran Cloud API). You can play individual verses or the entire surah.

**6. Daily Duas** — Supplications for waking up, sleeping, eating, leaving the house, entering the mosque, and more. All with Arabic, transliteration, translation, and source references.

There's also a **glossary** with 22 Islamic terms and 13 common Arabic phrases explained in plain English.

## Tools

- **Prayer Times** — Enter your location and get accurate prayer times using the AlAdhan API. Supports multiple calculation methods (ISNA, MWL, Umm Al-Qura, Egyptian).
- **Qibla Finder** — Uses your device's GPS to calculate the direction of the Kaaba from wherever you are. Pure math, no API needed.
- **Mosque Finder** — Helps you locate nearby mosques using map search.

## Progress tracking

Your progress is saved in your browser's localStorage. Mark lessons as complete, and the app tracks what you've finished, shows progress bars per module, and picks up where you left off. No account needed — but this also means your progress is tied to that specific browser.

## Design

The app uses a warm, calming color palette:
- Deep forest green (`#2D6A4F`) as the primary color
- Warm gold (`#D4A574`) as an accent
- Cream background (`#FEFCF3`)

Three font families: Plus Jakarta Sans for headings, Inter for body text, and Amiri for Arabic script. All Arabic text renders right-to-left at a minimum of 24px for readability.

Dark mode is supported and respects your system preference.

No photos of people or faces anywhere — the app uses geometric patterns and abstract elements only, following Islamic guidelines.

## Content integrity

This is the most important part of the project. Every piece of religious content comes from pre-verified JSON files in `src/data/content/`. Nothing is generated on the fly. Every Quran verse, hadith, dua, and instruction has a source reference (Quran chapter:verse, Sahih Bukhari number, Sahih Muslim number, etc.). Any content item that hasn't been verified is automatically filtered out and never shown to users.

The content follows Sunni Islam (Ahl as-Sunnah wal-Jamaa'ah). Where differences exist between madhabs, the most common position is presented with a note that variations exist.

## Tech stack

- Next.js 14 with App Router (static site generation)
- TypeScript
- Tailwind CSS
- localStorage (no database, no backend)
- AlAdhan API for prayer times (free, no key required)
- Al Quran Cloud API for Quran audio (free, no key required)
- Deployed on Vercel

## Running locally

```bash
git clone https://github.com/Abdalla-Eldoumani/noor-guide.git
cd noor-guide
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Deploying

Push to GitHub, import into Vercel, and deploy. No environment variables or API keys to configure. It just works.

## Routes

| Path | Page |
|------|------|
| `/` | Landing page |
| `/learn` | Learning dashboard |
| `/learn/aqeedah` | Beliefs & creed |
| `/learn/pillars` | Five Pillars overview |
| `/learn/wudu` | Ablution guide |
| `/learn/salah` | Prayer guide |
| `/learn/surahs` | Essential surahs with audio |
| `/learn/duas` | Daily supplications |
| `/learn/glossary` | Islamic terms & phrases |
| `/tools` | Tools index |
| `/tools/prayer-times` | Prayer times by location |
| `/tools/qibla` | Qibla direction |
| `/tools/masjid-finder` | Mosque locator |
| `/progress` | Your learning progress |

## Project structure

```
src/
├── app/                 # All pages and routes
├── components/
│   ├── ui/              # Button, Card, ProgressBar, ArabicText, AudioPlayer, Modal, etc.
│   ├── layout/          # Header, Footer, MobileNav, Breadcrumb, PageWrapper
│   ├── learn/           # LessonContent, StepByStep, SurahPlayer, QuranVerse, HadithBlock
│   └── tools/           # LocationPicker, PrayerTimesDisplay, QiblaCompass, MasjidCard
├── data/content/        # 9 verified JSON files with all Islamic content
├── hooks/               # useProgress, useSettings, useLocalStorage, usePrayerTimes, etc.
├── lib/                 # content.ts, storage.ts, prayer-times.ts, quran-api.ts, qibla.ts
├── styles/              # globals.css with Tailwind layers
└── types/               # TypeScript interfaces for content and API responses
```

## License

[MIT](LICENSE)
