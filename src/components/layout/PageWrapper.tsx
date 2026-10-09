import type { ReactNode } from "react";

export function PageWrapper({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-book px-5 pt-8 sm:px-8 sm:pt-10">{children}</div>;
}
