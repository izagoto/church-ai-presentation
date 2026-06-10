import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type BadgeVariant = "default" | "red" | "blue" | "purple" | "green" | "warning";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  children: ReactNode;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-white/10 bg-white/[0.05] text-white/70",
  red: "border-red-500/20 bg-red-500/15 text-red-200",
  blue: "border-blue-500/20 bg-blue-500/15 text-blue-200",
  purple: "border-purple-500/20 bg-purple-500/15 text-purple-200",
  green: "border-green-500/20 bg-green-500/15 text-green-300",
  warning: "border-yellow-500/20 bg-yellow-500/15 text-yellow-300",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
