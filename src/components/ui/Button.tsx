"use client";

import { Link } from "@/i18n/navigation";
import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline" | "quiet";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & { href?: undefined };

type ButtonAsLink = ButtonBaseProps & { href: string };

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-fajr text-paper hover:bg-[color-mix(in_oklab,var(--color-fajr)_85%,var(--color-ink))]",
  outline: "border border-fajr text-fajr hover:bg-fajr/10",
  quiet: "text-fajr hover:bg-fajr/10",
};

export function Button({ variant = "primary", children, className = "", ...rest }: ButtonProps) {
  const classes = [
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-4 py-2",
    "font-ui text-ui font-medium transition-colors duration-150",
    "disabled:cursor-not-allowed disabled:opacity-60",
    VARIANTS[variant],
    className,
  ].join(" ");

  if ("href" in rest && rest.href) {
    return (
      <Link href={rest.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { href: _href, ...buttonProps } = rest as ButtonAsButton;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

type ButtonProps = ButtonAsButton | ButtonAsLink;
