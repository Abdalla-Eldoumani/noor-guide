import type { ReactNode } from "react";

// Qur'an, du'a and the words said in prayer sit on a quiet wash, apart from
// the explanation around them.
export function RecitationBlockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="space-y-3 rounded-panel bg-wash px-5 py-5 sm:px-6">{children}</blockquote>
  );
}
