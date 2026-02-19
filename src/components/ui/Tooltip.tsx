import type { ReactNode } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ text, children, className = "" }: TooltipProps) {
  const id = `tooltip-${text.replace(/\s+/g, "-").toLowerCase().slice(0, 20)}`;

  return (
    <span className={`relative inline-block group ${className}`}>
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-ink text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
      >
        {text}
        <span
          className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink"
          aria-hidden="true"
        />
      </span>
    </span>
  );
}

export default Tooltip;
