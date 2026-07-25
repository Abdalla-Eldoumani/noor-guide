import { useTranslations } from "next-intl";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  label?: string;
  color?: string;
}

export function ProgressBar({
  value,
  max = 100,
  className = "",
  label,
  color = "bg-primary-500",
}: ProgressBarProps) {
  const tLandmarks = useTranslations("landmarks");
  const percent = max > 0 ? (value / max) * 100 : 0;
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-ink">{label}</span>
          <span className="text-sm font-medium text-muted">{Math.round(clamped)}%</span>
        </div>
      )}
      <div
        className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || tLandmarks("progress")}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
