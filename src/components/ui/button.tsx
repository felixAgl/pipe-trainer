"use client";

import { cn } from "@/lib/utils";

const VARIANT = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  DANGER: "danger",
  GHOST: "ghost",
} as const;

type ButtonVariant = (typeof VARIANT)[keyof typeof VARIANT];

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}

export function Button({
  children,
  onClick,
  variant = VARIANT.PRIMARY,
  disabled = false,
  className,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        variant === VARIANT.PRIMARY &&
          "bg-pt-accent text-black hover:bg-pt-accent/90",
        variant === VARIANT.SECONDARY &&
          "border border-pt-border bg-pt-card text-white hover:bg-pt-border",
        variant === VARIANT.DANGER &&
          "bg-red-600 text-white hover:bg-red-700",
        variant === VARIANT.GHOST &&
          "text-pt-muted hover:bg-pt-card hover:text-white",
        className
      )}
    >
      {children}
    </button>
  );
}

export { VARIANT };
export type { ButtonVariant };
