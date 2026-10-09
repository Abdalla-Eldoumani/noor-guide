"use client";

import { useTranslations } from "next-intl";
import { Bookmark } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";

const NONE: string[] = [];

export function BookmarkToggle({ id }: { id: string }) {
  const t = useTranslations("duas");
  const [saved, setSaved] = useLocalStorage<string[]>(STORAGE_KEYS.bookmarks, NONE);
  const on = saved.includes(id);

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? t("bookmarkRemove") : t("bookmarkAdd")}
      onClick={() => setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))}
      className={`flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-150 hover:bg-wash ${
        on ? "text-fajr" : "text-ink-2"
      }`}
    >
      <Bookmark size={20} strokeWidth={1.5} fill={on ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
