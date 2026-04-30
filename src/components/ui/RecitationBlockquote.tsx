import type { ReactNode } from "react";

type RecitationBlockquoteProps = {
  children: ReactNode;
  className?: string;
};

export function RecitationBlockquote({
  children,
  className = "",
}: RecitationBlockquoteProps) {
  return (
    <blockquote
      className={`border-s-2 border-accent-400 ps-5 py-1 my-3 space-y-3 ${className}`}
    >
      {children}
    </blockquote>
  );
}
