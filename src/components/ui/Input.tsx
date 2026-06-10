import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function Input({
  leftIcon,
  rightIcon,
  className,
  ...props
}: InputProps) {
  return (
    <div
      className={cn(
        "flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 transition focus-within:border-red-500/50 focus-within:bg-white/[0.05]",
        className,
      )}
    >
      {leftIcon && <div className="text-white/45">{leftIcon}</div>}

      <input
        className="h-full flex-1 border-none bg-transparent text-sm text-white outline-none placeholder:text-white/35"
        {...props}
      />

      {rightIcon && <div className="text-white/45">{rightIcon}</div>}
    </div>
  );
}
