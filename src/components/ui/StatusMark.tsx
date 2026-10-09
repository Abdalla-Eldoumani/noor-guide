// Ochre ring while a module is under way, a sage tick once it is done, and
// nothing before it is started. The label is for screen readers only.
export type ModuleStatus = "done" | "current" | "none";

export function StatusMark({ status, label }: { status: ModuleStatus; label?: string }) {
  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center">
      {status === "current" && (
        <span aria-hidden="true" className="size-3.5 rounded-full border-2 border-ochre" />
      )}
      {status === "done" && (
        <svg
          viewBox="0 0 20 20"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="text-sage"
        >
          <path d="M4.5 10.5l3.5 3.5 7.5-8" />
        </svg>
      )}
      {label && status !== "none" && <span className="sr-only">{label}</span>}
    </span>
  );
}
