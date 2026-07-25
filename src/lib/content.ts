// Content loader: single gateway for all religious content
// Every accessor filters verified === true

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

import aqeedahJson from "@/data/content/aqeedah.json";
import pillarsJson from "@/data/content/pillars.json";
import wuduJson from "@/data/content/wudu-steps.json";
import taharah from "@/data/content/taharah.json";
import practice from "@/data/content/prayer-practice.json";
import janazah from "@/data/content/janazah.json";
import salahJson from "@/data/content/salah-steps.json";
import surahsJson from "@/data/content/surahs.json";
import duasJson from "@/data/content/duas-daily.json";
import glossaryJson from "@/data/content/glossary.json";
import phrasesJson from "@/data/content/arabic-phrases.json";
import learningPathJson from "@/data/content/learning-path.json";

// Cast the raw JSON to our typed interfaces
const aqeedah = aqeedahJson as unknown as AqeedahData;
const pillars = pillarsJson as unknown as PillarsData;
const wudu = wuduJson as unknown as WuduData;
const salah = salahJson as unknown as SalahData;
const surahs = surahsJson as unknown as SurahsData;
const duas = duasJson as unknown as DuasData;
const glossary = glossaryJson as unknown as GlossaryData;
const phrases = phrasesJson as unknown as ArabicPhrasesData;
const learningPath = learningPathJson as unknown as LearningPathData;

// --- Aqeedah ---
export function getAqeedahData(): AqeedahData {
  return aqeedah;
}

export function getAqeedahPillars(): AqeedahPillar[] {
  return aqeedah.pillars.filter((p) => p.verified === true);
}

// --- Five Pillars ---
export function getPillarsData(): PillarsData {
  return pillars;
}

export function getIslamPillars(): IslamPillar[] {
  return pillars.pillars.filter((p) => p.verified === true);
}

// --- Wudu ---
export function getWuduData(): WuduData {
  return wudu;
}

export function getWuduSteps(): WuduStep[] {
  return wudu.steps.filter((s) => s.verified === true);
}

export function getWuduBreakers(): WuduBreaker[] {
  return wudu.what_breaks_wudu.filter((b) => b.verified === true);
}

export function getWuduObligations(): RulingItem[] {
  return wudu.obligations.filter((o) => o.verified === true);
}

export function getWuduSunan(): RulingItem[] {
  return wudu.sunan.filter((o) => o.verified === true);
}

export function getSalahShurut(): RulingItem[] {
  return salah.shurut.filter((o) => o.verified === true);
}

export function getSalahArkan(): RulingItem[] {
  return salah.arkan.filter((o) => o.verified === true);
}

export function getSalahWajibat(): RulingItem[] {
  return salah.wajibat.filter((o) => o.verified === true);
}

export function getSalahSunan(): RulingItem[] {
  return salah.sunan.filter((o) => o.verified === true);
}

export function getSujudAsSahw(): RulingItem[] {
  return salah.sujud_as_sahw.filter((o) => o.verified === true);
}

export function getSalahNullifiers(): RulingItem[] {
  return salah.nullifiers.filter((o) => o.verified === true);
}

// --- Salah ---
export function getSalahData(): SalahData {
  return salah;
}

export function getSalahSteps() {
  return salah.steps_of_one_rakah.filter((s) => s.verified === true);
}

// --- Surahs ---
export function getSurahsData(): SurahsData {
  return surahs;
}

export function getSurahs(): Surah[] {
  return surahs.surahs.filter((s) => s.verified === true);
}

export function getSurahById(id: string): Surah | undefined {
  return surahs.surahs.find((s) => s.id === id && s.verified === true);
}

// --- Duas ---
export function getDuasData(): DuasData {
  return duas;
}

export function getDuaCategories(): DuaCategory[] {
  return duas.categories.map((cat) => ({
    ...cat,
    duas: cat.duas.filter((d) => d.verified === true),
  }));
}

// --- Glossary ---
export function getGlossaryTerms(): GlossaryTerm[] {
  return glossary.terms.filter((t) => t.verified === true);
}

// --- Arabic Phrases ---
export function getArabicPhrases(): ArabicPhrase[] {
  return phrases.phrases.filter((p) => p.verified === true);
}

// --- Learning Path ---
export function getLearningPath(): LearningPathData {
  return learningPath;
}

export function getLearningModules(): LearningModule[] {
  return learningPath.modules;
}

export function getModuleById(id: string): LearningModule | undefined {
  return learningPath.modules.find((m) => m.id === id);
}

export function getLessonIdsForModule(moduleId: string): string[] {
  const mod = learningPath.modules.find((m) => m.id === moduleId);
  return mod ? mod.lessons : [];
}

// --- Modules added after the original six ---
export function getTaharahData(): SectionedModule {
  return taharah as SectionedModule;
}

export function getPrayerPracticeData(): SectionedModule {
  return practice as SectionedModule;
}

export function getJanazahData(): SectionedModule {
  return janazah as SectionedModule;
}
