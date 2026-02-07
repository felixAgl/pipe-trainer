"use client";

import { cn } from "@/lib/utils";

interface InputFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}

export function InputField({
  label,
  value,
  onChange,
  placeholder,
  className,
  type = "text",
}: InputFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label className="text-xs font-medium text-pt-muted uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-md border border-pt-border bg-pt-card px-3 py-2 text-sm text-white placeholder-pt-muted focus:border-pt-accent focus:outline-none"
      />
    </div>
  );
}
