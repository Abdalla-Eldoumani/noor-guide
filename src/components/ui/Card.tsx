import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  href?: string;
}

export function Card({ children, className = "", href }: CardProps) {
  if (href) {
    return (
      <Link href={href} className={`card block ${className}`}>
        {children}
      </Link>
    );
  }

  return <div className={`card ${className}`}>{children}</div>;
}

export default Card;
