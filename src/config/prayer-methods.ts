// AlAdhan calculation method ids — see https://aladhan.com/calculation-methods
export type PrayerMethod = {
  id: number;
  name: string;
};

export const PRAYER_METHODS: PrayerMethod[] = [
  { id: 2, name: "Islamic Society of North America (ISNA)" },
  { id: 3, name: "Muslim World League (MWL)" },
  { id: 4, name: "Umm Al-Qura University, Makkah" },
  { id: 5, name: "Egyptian General Authority of Survey" },
  { id: 1, name: "University of Islamic Sciences, Karachi" },
];

export const DEFAULT_PRAYER_METHOD = 2;
