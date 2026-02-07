"use client";

import { useState, useEffect } from "react";
import { fetchMuscleGroupsWithExercises } from "@/lib/exercise-repository";
import { EXERCISE_SUGGESTIONS } from "@/lib/exercise-suggestions";
import { cn } from "@/lib/utils";

interface MuscleGroupSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function MuscleGroupSelect({ value, onChange, className }: MuscleGroupSelectProps) {
  const [groups, setGroups] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetchMuscleGroupsWithExercises()
      .then((data) => {
        if (cancelled) return;
        if (data.length > 0) {
          setGroups(data.map((g) => g.name));
        } else {
          setGroups(Object.keys(EXERCISE_SUGGESTIONS));
        }
      })
      .catch(() => {
        if (cancelled) return;
        setGroups(Object.keys(EXERCISE_SUGGESTIONS));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const fallbackGroups = groups.length > 0 ? groups : Object.keys(EXERCISE_SUGGESTIONS);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full rounded-md border border-pt-border bg-pt-card px-2 py-2 text-sm text-white focus:border-pt-accent focus:outline-none sm:px-3",
        className
      )}
    >
      <option value="">Grupo muscular</option>
      {fallbackGroups.map((group) => (
        <option key={group} value={group}>
          {group}
        </option>
      ))}
    </select>
  );
}
