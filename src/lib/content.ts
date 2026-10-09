// Server-side reads of the religious content. Client components receive what
// they need as props, so none of this JSON ends up in a browser bundle.

import type {
  AqeedahData,
  AqeedahPillar,
  PillarsData,
  IslamPillar,
  WuduData,
  WuduStep,
  WuduBreaker,
  RulingItem,
  SectionedModule,
  SalahData,
  SalahStep,
  SurahsData,
  Surah,
  DuasData,
  DuaCategory,
  GlossaryData,
  GlossaryTerm,
  ArabicPhrasesData,
  ArabicPhrase,
  LearningPathData,
  LearningModule,
} from "@/types/content";
import { pickLocalized } from "@/lib/content-i18n";

import aqeedahJson from "@/data/content/aqeedah.json";
import pillarsJson from "@/data/content/pillars.json";
import wuduJson from "@/data/content/wudu-steps.json";
import taharahJson from "@/data/content/taharah.json";
import practiceJson from "@/data/content/prayer-practice.json";
import janazahJson from "@/data/content/janazah.json";
import salahJson from "@/data/content/salah-steps.json";
import surahsJson from "@/data/content/surahs.json";
import duasJson from "@/data/content/duas-daily.json";
import glossaryJson from "@/data/content/glossary.json";
import phrasesJson from "@/data/content/arabic-phrases.json";
import learningPathJson from "@/data/content/learning-path.json";

const aqeedah = aqeedahJson as unknown as AqeedahData;
const pillars = pillarsJson as unknown as PillarsData;
const wudu = wuduJson as unknown as WuduData;
const salah = salahJson as unknown as SalahData;
const surahs = surahsJson as unknown as SurahsData;
const duas = duasJson as unknown as DuasData;
const glossary = glossaryJson as unknown as GlossaryData;
const phrases = phrasesJson as unknown as ArabicPhrasesData;
const learningPath = learningPathJson as unknown as LearningPathData;

const verifiedOnly = <T extends { verified: boolean }>(items: T[]): T[] =>
  items.filter((item) => item.verified === true);

// --- Aqeedah ---
export function getAqeedahData(): AqeedahData {
  return aqeedah;
}

export function getAqeedahPillars(): AqeedahPillar[] {
  return verifiedOnly(aqeedah.pillars);
}

// --- Five Pillars ---
export function getPillarsData(): PillarsData {
  return pillars;
}

export function getIslamPillars(): IslamPillar[] {
  return verifiedOnly(pillars.pillars);
}

// --- Wudu ---
export function getWuduData(): WuduData {
  return wudu;
}

export function getWuduSteps(): WuduStep[] {
  return verifiedOnly(wudu.steps);
}

export function getWuduBreakers(): WuduBreaker[] {
  return verifiedOnly(wudu.what_breaks_wudu);
}

export function getWuduObligations(): RulingItem[] {
  return verifiedOnly(wudu.obligations);
}

export function getWuduSunan(): RulingItem[] {
  return verifiedOnly(wudu.sunan);
}

// --- Salah ---
export function getSalahData(): SalahData {
  return salah;
}

export function getSalahSteps(): SalahStep[] {
  return verifiedOnly(salah.steps_of_one_rakah);
}

export function getSalahShurut(): RulingItem[] {
  return verifiedOnly(salah.shurut);
}

export function getSalahArkan(): RulingItem[] {
  return verifiedOnly(salah.arkan);
}

export function getSalahWajibat(): RulingItem[] {
  return verifiedOnly(salah.wajibat);
}

export function getSalahSunan(): RulingItem[] {
  return verifiedOnly(salah.sunan);
}

export function getSujudAsSahw(): RulingItem[] {
  return verifiedOnly(salah.sujud_as_sahw);
}

export function getSalahNullifiers(): RulingItem[] {
  return verifiedOnly(salah.nullifiers);
}

// --- Surahs ---
export function getSurahsData(): SurahsData {
  return surahs;
}

export function getSurahs(): Surah[] {
  return verifiedOnly(surahs.surahs);
}

// --- Duas ---
export function getDuasData(): DuasData {
  return duas;
}

export function getDuaCategories(): DuaCategory[] {
  return duas.categories.map((cat) => ({ ...cat, duas: verifiedOnly(cat.duas) }));
}

// --- Glossary ---
export function getGlossaryTerms(): GlossaryTerm[] {
  return verifiedOnly(glossary.terms);
}

export function getArabicPhrases(): ArabicPhrase[] {
  return verifiedOnly(phrases.phrases);
}

// --- Modules built from an introduction plus sections ---
function withVerifiedItems(data: SectionedModule): SectionedModule {
  return {
    ...data,
    sections: data.sections.map((section) => ({
      ...section,
      items: verifiedOnly(section.items),
    })),
  };
}

export function getTaharahData(): SectionedModule {
  return withVerifiedItems(taharahJson as SectionedModule);
}

export function getPrayerPracticeData(): SectionedModule {
  return withVerifiedItems(practiceJson as SectionedModule);
}

export function getJanazahData(): SectionedModule {
  return withVerifiedItems(janazahJson as SectionedModule);
}

// --- Learning path ---
export function getLearningModules(): LearningModule[] {
  return learningPath.modules;
}

export function getModuleById(id: string): LearningModule | undefined {
  return learningPath.modules.find((m) => m.id === id);
}

export function getLessonIdsForModule(moduleId: string): string[] {
  return getModuleById(moduleId)?.lessons ?? [];
}

export interface ModuleSummary {
  id: string;
  number: number;
  title: string;
  titleAr: string;
  lessons: string[];
  minutes: number;
}

export function getModuleSummaries(locale: string): ModuleSummary[] {
  return learningPath.modules.map((m, index) => ({
    id: m.id,
    number: index + 1,
    title: pickLocalized<string>(m, "title", locale) ?? m.title_en,
    titleAr: m.title_ar,
    lessons: m.lessons,
    minutes: m.estimatedMinutes,
  }));
}

export interface ModuleNavLink {
  href: string;
  title: string;
}

export interface ModuleNav {
  moduleId: string;
  number: number;
  total: number;
  lessonIds: string[];
  prev?: ModuleNavLink;
  next?: ModuleNavLink;
}

// Previous and next follow the order of the learning path, so adding a module
// to learning-path.json links it in without touching any page.
export function getModuleNav(moduleId: string, locale: string): ModuleNav {
  const modules = learningPath.modules;
  const index = modules.findIndex((m) => m.id === moduleId);
  const link = (m?: LearningModule): ModuleNavLink | undefined =>
    m && {
      href: `/learn/${m.id}`,
      title: pickLocalized<string>(m, "title", locale) ?? m.title_en,
    };
  return {
    moduleId,
    number: index + 1,
    total: modules.length,
    lessonIds: modules[index]?.lessons ?? [],
    prev: link(modules[index - 1]),
    next: link(modules[index + 1]),
  };
}
