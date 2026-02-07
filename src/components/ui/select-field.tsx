"use client";

import { cn } from "@/lib/utils";

interface SelectFieldProps {
  label?: string;
  value: string | number;
  options: (string | number)[];
  onChange: (value: string) => void;
  className?: string;
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  className,
}: SelectFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label className="text-xs font-medium text-pt-muted uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-pt-border bg-pt-card px-2 py-2 text-sm text-white focus:border-pt-accent focus:outline-none sm:px-3"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
