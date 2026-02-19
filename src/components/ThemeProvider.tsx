"use client";

import { useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [settings.theme]);

  return <>{children}</>;
}
