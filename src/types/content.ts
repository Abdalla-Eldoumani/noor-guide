// Types for all content JSON schemas

export interface QuranReference {
  reference: string;
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface HadithSource {
  type: "hadith";
  reference: string;
  text_en?: string;
  grade: "sahih" | "hasan" | "n/a";
}

export interface QuranSource {
  type: "quran";
  reference: string;
  grade?: string;
}

export interface ContentSource {
  type: "quran" | "hadith" | "scholarly_consensus";
  reference: string;
  text_en?: string;
  grade?: "sahih" | "hasan" | "n/a";
}

// Aqeedah (Six Pillars of Iman)
export interface AqeedahPillar {
  id: string;
  order: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  key_points: string[];
  quran_references: QuranReference[];
  hadith_reference?: {
    text_en: string;
    reference: string;
    grade: string;
  };
  verified: boolean;
}

export interface AqeedahData {
  module_id: string;
  title_en: string;
  title_ar: string;
  introduction: {
    content_en: string;
    source: HadithSource & { text_en: string };
  };
  pillars: AqeedahPillar[];
}

// Five Pillars of Islam
export interface IslamPillar {
  id: string;
  order: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  content?: {
    arabic: string;
    transliteration: string;
    translation: string;
  };
  link_to_module?: string;
  notes?: string;
  quran_reference?: {
    reference: string;
    translation: string;
  };
  verified: boolean;
}

export interface PillarsData {
  module_id: string;
  title_en: string;
  title_ar: string;
  introduction: {
    content_en: string;
    source: HadithSource & { text_en: string };
  };
  pillars: IslamPillar[];
}

// Wudu Steps
export interface WuduStep {
  id: string;
  order: number;
  title_en: string;
  title_ar: string;
  instruction_en: string;
  repetitions?: number;
  notes?: string;
  content?: {
    arabic: string;
    transliteration: string;
    translation: string;
  };
  source?: ContentSource;
  verified: boolean;
}

export interface WuduBreaker {
  id: string;
  description: string;
  source?: string;
  notes?: string;
  verified: boolean;
}

export interface WuduData {
  module_id: string;
  title_en: string;
  title_ar: string;
  introduction: {
    content_en: string;
    source: HadithSource & { text_en: string };
  };
  prerequisites: string[];
  steps: WuduStep[];
  dua_after_wudu: {
    arabic: string;
    transliteration: string;
    translation: string;
    source: ContentSource;
    verified: boolean;
  };
  what_breaks_wudu: WuduBreaker[];
}

// Salah Steps
export interface Recitation {
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface SalahStep {
  id: string;
  order: number;
  title_en: string;
  title_ar: string;
  position: string;
  instruction_en: string;
  recitation?: Recitation;
  recitation_rising?: Recitation;
  recitation_standing?: Recitation;
  after_fatiha?: string;
  repetitions?: number;
  notes?: string;
  source?: ContentSource;
  verified: boolean;
}

export interface FivePrayer {
  name_en: string;
  name_ar: string;
  time: string;
  fardh_rakaat: number;
  sunnah_before: number;
  sunnah_after: number;
}

export interface SalahSection {
  title_en: string;
  title_ar: string;
  when?: string;
  instruction_en?: string;
  recitation: Recitation;
  source: ContentSource;
  finger_note?: string;
  verified: boolean;
}

export interface SalahData {
  module_id: string;
  title_en: string;
  title_ar: string;
  introduction: {
    content_en: string;
    source: HadithSource & { text_en: string };
  };
  prerequisites: string[];
  five_prayers: FivePrayer[];
  steps_of_one_rakah: SalahStep[];
  tashahhud: SalahSection;
  salawat_ibrahimiyyah: SalahSection;
  tasleem: SalahSection;
}

// Surahs
export interface Verse {
  verse: number;
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface Surah {
  id: string;
  number: number;
  title_en: string;
  title_ar: string;
  priority: string;
  verses: Verse[];
  audio_api_url: string;
  verified: boolean;
}

export interface SurahsData {
  module_id: string;
  title_en: string;
  title_ar: string;
  introduction: {
    content_en: string;
    notes: string;
  };
  surahs: Surah[];
}

// Duas
export interface Dua {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  context?: string;
  notes?: string;
  source: {
    reference: string;
    grade: string;
  };
  verified: boolean;
}

export interface DuaCategory {
  id: string;
  title_en: string;
  duas: Dua[];
}

export interface DuasData {
  module_id: string;
  title_en: string;
  title_ar: string;
  introduction: {
    content_en: string;
  };
  categories: DuaCategory[];
}

// Glossary
export interface GlossaryTerm {
  id: string;
  term_en: string;
  term_ar: string;
  definition: string;
  verified: boolean;
}

export interface GlossaryData {
  module_id: string;
  terms: GlossaryTerm[];
}

// Arabic Phrases
export interface ArabicPhrase {
  id: string;
  phrase_ar: string;
  transliteration: string;
  translation: string;
  usage: string;
  verified: boolean;
}

export interface ArabicPhrasesData {
  module_id: string;
  title_en: string;
  phrases: ArabicPhrase[];
}

// Learning Path
export interface LearningModule {
  id: string;
  order: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  icon: string;
  estimatedMinutes: number;
  lessons: string[];
}

export interface LearningPathData {
  version: string;
  description: string;
  modules: LearningModule[];
}

// localStorage schemas
export interface NoorSettings {
  theme: "light" | "dark";
  language: "en";
  prayerMethod: number;
  location: { lat: number; lng: number; name: string } | null;
}

export interface NoorProgress {
  completedLessons: string[];
  currentLesson: string | null;
  startedAt: string;
  lastActiveAt: string;
  streakDays: number;
}
