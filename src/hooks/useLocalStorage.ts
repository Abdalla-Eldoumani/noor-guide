"use client";

import { useState, useEffect, useCallback } from "react";
import { getItem, setItem } from "@/lib/storage";

/**
 * Generic SSR-safe localStorage hook.
 * Returns defaultValue during SSR, reads actual value after mount.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);

  // Read from localStorage after mount
  useEffect(() => {
    setStoredValue(getItem<T>(key, defaultValue));
  }, [key, defaultValue]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        setItem(key, next);
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
