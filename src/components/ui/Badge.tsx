import type { ReactNode } from "react";

type BadgeVariant = "completed" | "in-progress" | "locked";

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  completed: "bg-green-100 text-green-800",
  "in-progress": "bg-accent-100 text-accent-700",
  locked: "bg-gray-100 text-gray-400",
};

export function Badge({ variant, children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
