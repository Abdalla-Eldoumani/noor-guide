const positionSymbols: Record<string, { symbol: string; label: string }> = {
  standing: { symbol: "▏", label: "Standing" },
  "standing-hands-raised": { symbol: "🙌", label: "Standing (Hands Raised)" },
  "standing-hands-folded": { symbol: "▏", label: "Standing (Hands Folded)" },
  bowing: { symbol: "∠", label: "Bowing" },
  prostrating: { symbol: "⌐", label: "Prostrating" },
  sitting: { symbol: "⌊", label: "Sitting" },
};

interface PrayerPositionProps {
  position: string;
  label: string;
}

export function PrayerPosition({ position, label }: PrayerPositionProps) {
  const data = positionSymbols[position] || {
    symbol: "▏",
    label: position,
  };

  return (
    <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 rounded-lg px-3 py-1.5 text-sm font-medium">
      <span className="text-lg leading-none" aria-hidden="true">
        {data.symbol}
      </span>
      <span>{label}</span>
    </div>
  );
}
