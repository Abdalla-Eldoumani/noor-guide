"use client";

import { useCallback, useSyncExternalStore } from "react";

// One shared store per key, so every component reading a key sees a write at
// once, and the write lands in localStorage before any component unmounts.
// When storage is unavailable (private browsing, a full quota) values live in
// memory for the session instead.

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
const memory = new Map<string, string>();
const parsed = new Map<string, { raw: string | null; value: unknown }>();

function readRaw(key: string): string | null {
  if (memory.has(key)) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Stored data from an older version may lack fields or have the wrong shape;
// the fallback fills the gaps rather than letting a bad value through.
function conform<T>(value: unknown, fallback: T): T {
  if (Array.isArray(fallback)) return (Array.isArray(value) ? value : fallback) as T;
  if (isPlainObject(fallback)) return (isPlainObject(value) ? { ...fallback, ...value } : fallback) as T;
  return (value ?? fallback) as T;
}

function read<T>(key: string, fallback: T): T {
  const raw = readRaw(key);
  const hit = parsed.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value = fallback;
  if (raw !== null) {
    try {
      value = conform(JSON.parse(raw), fallback);
    } catch {
      value = fallback;
    }
  }
  parsed.set(key, { raw, value });
  return value;
}

function write<T>(key: string, value: T) {
  const raw = JSON.stringify(value);
  try {
    window.localStorage.setItem(key, raw);
    memory.delete(key);
  } catch {
    memory.set(key, raw);
  }
  listeners.get(key)?.forEach((listener) => listener());
}

function subscribe(key: string, listener: Listener) {
  const set = listeners.get(key) ?? new Set<Listener>();
  set.add(listener);
  listeners.set(key, set);
  // Another tab changed the same key.
  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    set.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// `fallback` must be a module-level constant: it is also the server snapshot.
export function useLocalStorage<T>(
  key: string,
  fallback: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    useCallback((listener: Listener) => subscribe(key, listener), [key]),
    () => read(key, fallback),
    () => fallback,
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = read(key, fallback);
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      if (!Object.is(resolved, prev)) write(key, resolved);
    },
    [key, fallback],
  );

  return [value, setValue];
}
