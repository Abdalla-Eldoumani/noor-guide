type StarOctagramProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

export function StarOctagram({
  size = 96,
  className = "",
  strokeWidth = 1.25,
}: StarOctagramProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="50" cy="50" r="46" strokeOpacity="0.25" />
      <rect x="22" y="22" width="56" height="56" />
      <rect
        x="22"
        y="22"
        width="56"
        height="56"
        transform="rotate(45 50 50)"
      />
      <circle cx="50" cy="50" r="6" strokeOpacity="0.55" />
    </svg>
  );
}
