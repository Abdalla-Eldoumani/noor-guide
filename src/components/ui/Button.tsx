"use client";

import { Link } from "@/i18n/navigation";
import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps & {
  href: string;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500",
  secondary:
    "bg-accent-400 text-white hover:bg-accent-500 focus-visible:ring-accent-400",
  outline:
    "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus-visible:ring-primary-500",
  ghost:
    "text-primary-500 hover:bg-primary-50 focus-visible:ring-primary-500",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-5 py-2.5 text-base gap-2",
  lg: "px-7 py-3.5 text-lg gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  children,
  className = "",
  ...rest
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center font-heading font-semibold rounded-xl",
    "transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(" ");

  const content = (
    <>
      {Icon && iconPosition === "left" && <span className="shrink-0">{Icon}</span>}
      {children}
      {Icon && iconPosition === "right" && <span className="shrink-0">{Icon}</span>}
    </>
  );

  if ("href" in rest && rest.href) {
    return (
      <Link href={rest.href} className={classes}>
        {content}
      </Link>
    );
  }

  const { href: _, ...buttonProps } = rest as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {content}
    </button>
  );
}

export default Button;
