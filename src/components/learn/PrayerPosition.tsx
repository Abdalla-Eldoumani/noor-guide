import type { ReactElement } from "react";

// Each posture is shown as the line of the back against the floor rather than
// as a figure, because the site draws no people.
export type Posture = "standing" | "bowing" | "prostrating" | "sitting";

export function postureOf(position: string): Posture {
  if (position.startsWith("standing")) return "standing";
  if (position === "bowing" || position === "prostrating" || position === "sitting") return position;
  return "standing";
}

const MARKS: Record<Posture, ReactElement> = {
  standing: <path d="M12 4v16" />,
  bowing: <path d="M15.5 20V9.5H5" />,
  prostrating: <path d="M4.5 20l9-7.5 3.5 7.5" />,
  sitting: <path d="M8.5 6.5V20h9" />,
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
        {MARKS[posture]}
        <path d="M3.5 21h17" strokeOpacity="0.5" />
      </svg>
      {label}
    </span>
  );
}
