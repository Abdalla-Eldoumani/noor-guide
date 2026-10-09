import type { ReactElement } from "react";

// Small figures of the four postures of prayer, drawn in the same hand as the
// module glyphs, each with its name beside it.
export type Posture = "standing" | "bowing" | "prostrating" | "sitting";

export function postureOf(position: string): Posture {
  if (position.startsWith("standing")) return "standing";
  if (position === "bowing" || position === "prostrating" || position === "sitting") return position;
  return "standing";
}

const FIGURES: Record<Posture, ReactElement> = {
  standing: (
    <>
      <circle cx="12" cy="4.4" r="1.8" />
      <path d="M12 6.6v7.6" />
      <path d="M12 8.6l-2.2 4.2M12 8.6l2.2 4.2" />
      <path d="M12 14.2l-1.5 6.3M12 14.2l1.5 6.3" />
    </>
  ),
  bowing: (
    <>
      <circle cx="5.4" cy="9.3" r="1.8" />
      <path d="M7.4 9.8h8.2" />
      <path d="M15.6 9.8l-.6 10.7M15.6 9.8l1 10.7" />
      <path d="M9 10l5.6 4.8" />
    </>
  ),
  prostrating: (
    <>
      <circle cx="4.9" cy="18.6" r="1.8" />
      <path d="M6.6 17.5c2.4-3.6 5-5.4 8.4-5.7" />
      <path d="M15 11.8l-1.3 8.7h5.8" />
      <path d="M8.7 15.6l.9 4.9" />
    </>
  ),
  sitting: (
    <>
      <circle cx="9.3" cy="4.6" r="1.8" />
      <path d="M9.3 6.8l.4 8.2" />
      <path d="M9.7 15l6.6 4.2-7 1.3" />
      <path d="M9.5 8.8l4.6 6.6" />
    </>
  ),
};

export function PrayerPosition({ posture, label }: { posture: Posture; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-ui text-caption text-ink-2">
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {FIGURES[posture]}
        <path d="M3.5 21h17" strokeOpacity="0.5" />
      </svg>
      {label}
    </span>
  );
}
