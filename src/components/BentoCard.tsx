import type { PropsWithChildren } from "react";

interface BentoCardProps extends PropsWithChildren {
  className?: string;
  accent?: "cyan" | "violet" | "blue";
}

export default function BentoCard({
  children,
  className = "",
  accent = "cyan",
}: BentoCardProps) {
  return <div className={`bento-card bento-${accent} ${className}`}>{children}</div>;
}
