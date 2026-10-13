import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return <span className="platform-badge">{children}</span>;
}

