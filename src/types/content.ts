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
  text_ar?: string;
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
  text_ar?: string;
  grade?: "sahih" | "hasan" | "n/a";
}

// Aqeedah (Six Pillars of Iman)
export interface AqeedahPillar {
  id: string;
  order: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar?: string;
  key_points: string[];
  key_points_ar?: string[];
  quran_references: QuranReference[];
  hadith_reference?: {
    text_en: string;
    text_ar?: string;
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
    content_ar?: string;
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
  description_ar?: string;
  content?: {
    arabic: string;
    transliteration: string;
    translation: string;
    translation_ar?: string;
  };
  link_to_module?: string;
  notes?: string;
  notes_ar?: string;
  quran_reference?: {
    reference: string;
    translation: string;
    translation_ar?: string;
  };
  verified: boolean;
}

export interface PillarsData {
  module_id: string;
  title_en: string;
  title_ar: string;
  introduction: {
    content_en: string;
    content_ar?: string;
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
  instruction_ar?: string;
  repetitions?: number;
  notes?: string;
  notes_ar?: string;
  content?: {
    arabic: string;
    transliteration: string;
    translation: string;
    translation_ar?: string;
  };
  source?: ContentSource;
  verified: boolean;
}

export interface WuduBreaker {
  id: string;
  description: string;
  description_ar?: string;
  source?: string;
  notes?: string;
  notes_ar?: string;
  verified: boolean;
}

export interface WuduData {
  module_id: string;
  title_en: string;
  title_ar: string;
  introduction: {
    content_en: string;
    content_ar?: string;
    source: HadithSource & { text_en: string };
  };
  prerequisites: string[];
  prerequisites_ar?: string[];
  steps: WuduStep[];
  dua_after_wudu: {
    arabic: string;
    transliteration: string;
    translation: string;
    translation_ar?: string;
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
  translation_ar?: string;
}

export interface SalahStep {
  id: string;
  order: number;
  title_en: string;
  title_ar: string;
  position: string;
  instruction_en: string;
  instruction_ar?: string;
  recitation?: Recitation;
  recitation_rising?: Recitation;
  recitation_standing?: Recitation;
  after_fatiha?: string;
  after_fatiha_ar?: string;
  repetitions?: number;
  notes?: string;
  notes_ar?: string;
  source?: ContentSource;
  verified: boolean;
}

export interface FivePrayer {
  name_en: string;
  name_ar: string;
  time: string;
  time_ar?: string;
  fardh_rakaat: number;
  sunnah_before: number;
  sunnah_after: number;
}

export interface SalahSection {
  title_en: string;
  title_ar: string;
  when?: string;
  when_ar?: string;
  instruction_en?: string;
  instruction_ar?: string;
  recitation: Recitation;
  source: ContentSource;
  finger_note?: string;
  finger_note_ar?: string;
  verified: boolean;
}

export interface SalahData {
  module_id: string;
  title_en: string;
  title_ar: string;
  introduction: {
    content_en: string;
    content_ar?: string;
    source: HadithSource & { text_en: string };
  };
  prerequisites: string[];
  prerequisites_ar?: string[];
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
  translation_ar?: string;
}

export interface Surah {
  id: string;
  number: number;
  title_en: string;
  title_ar: string;
  priority: string;
  priority_ar?: string;
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
    content_ar?: string;
    notes: string;
    notes_ar?: string;
  };
  surahs: Surah[];
}

// Duas
export interface Dua {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  translation_ar?: string;
  context?: string;
  context_ar?: string;
  notes?: string;
  notes_ar?: string;
  source: {
    reference: string;
    grade: string;
  };
  verified: boolean;
}

export interface DuaCategory {
  id: string;
  title_en: string;
  title_ar?: string;
  duas: Dua[];
}

export interface DuasData {
  module_id: string;
  title_en: string;
  title_ar: string;
  introduction: {
    content_en: string;
    content_ar?: string;
  };
  categories: DuaCategory[];
}

// Glossary
export interface GlossaryTerm {
  id: string;
  term_en: string;
  term_ar: string;
  definition: string;
  definition_ar?: string;
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
  translation_ar?: string;
  usage: string;
  usage_ar?: string;
  verified: boolean;
}

export interface ArabicPhrasesData {
  module_id: string;
  title_en: string;
  title_ar?: string;
  phrases: ArabicPhrase[];
}

// Learning Path
export interface LearningModule {
  id: string;
  order: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar?: string;
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
