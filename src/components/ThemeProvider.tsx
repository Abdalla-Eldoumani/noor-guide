"use client";

import { useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";

export function ThemeSync() {
  const { settings } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [settings.theme]);

  return null;
}
