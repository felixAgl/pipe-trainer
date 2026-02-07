"use client";

import { useState } from "react";
import type { Exercise, RestTime } from "@/types/workout";
import {
  REST_TIME_OPTIONS,
  RIR_OPTIONS,
  RPE_OPTIONS,
  SERIES_OPTIONS,
  REPS_OPTIONS,
} from "@/types/workout";
import { SelectField } from "@/components/ui/select-field";
import { Button } from "@/components/ui/button";
import { getSuggestions } from "@/lib/exercise-suggestions";

interface ExerciseRowProps {
  exercise: Exercise;
  muscleGroup: string;
  onChange: (updated: Exercise) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function ExerciseRow({
  exercise,
  muscleGroup,
  onChange,
  onRemove,
  canRemove,
}: ExerciseRowProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  function handleNameChange(value: string) {
    onChange({ ...exercise, name: value });
    const filtered = getSuggestions(muscleGroup, value);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0 && value.length > 0);
  }

  function handleSelectSuggestion(name: string) {
    onChange({ ...exercise, name });
    setShowSuggestions(false);
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-pt-border/50 p-3 md:flex-row md:items-end md:gap-2 md:border-0 md:p-0">
      {/* Exercise Name with autocomplete - full width on mobile, 2fr on desktop */}
      <div className="relative flex flex-col gap-1 md:flex-[2]">
        <label className="text-xs font-medium text-pt-muted uppercase tracking-wide">
          Ejercicio
        </label>
        <input
          type="text"
          value={exercise.name}
          onChange={(e) => handleNameChange(e.target.value)}
          onFocus={() => {
            const filtered = getSuggestions(muscleGroup, exercise.name);
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
          }}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder="Nombre del ejercicio"
          className="rounded-md border border-pt-border bg-pt-card px-3 py-2 text-sm text-white placeholder-pt-muted focus:border-pt-accent focus:outline-none"
        />
        {showSuggestions && (
          <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-md border border-pt-border bg-pt-card shadow-lg">
            {suggestions.slice(0, 8).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onMouseDown={() => handleSelectSuggestion(suggestion)}
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-pt-accent hover:text-black"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selectors grid - 3 cols on mobile, inline on desktop */}
      <div className="grid grid-cols-3 gap-2 md:flex md:flex-[4] md:gap-2">
        <SelectField
          label="Series"
          value={exercise.series}
          options={[...SERIES_OPTIONS]}
          onChange={(v) =>
            onChange({ ...exercise, series: Number(v) as Exercise["series"] })
          }
        />

        <SelectField
          label="Reps"
          value={exercise.reps}
          options={[...REPS_OPTIONS]}
          onChange={(v) => onChange({ ...exercise, reps: Number(v) })}
        />

        <SelectField
          label="Descanso"
          value={exercise.restTime}
          options={[...REST_TIME_OPTIONS]}
          onChange={(v) => onChange({ ...exercise, restTime: v as RestTime })}
        />

        <SelectField
          label="RIR"
          value={exercise.rir}
          options={[...RIR_OPTIONS]}
          onChange={(v) =>
            onChange({ ...exercise, rir: Number(v) as Exercise["rir"] })
          }
        />

        <SelectField
          label="RPE"
          value={exercise.rpe}
          options={[...RPE_OPTIONS]}
          onChange={(v) =>
            onChange({ ...exercise, rpe: Number(v) as Exercise["rpe"] })
          }
        />

        <div className="flex items-end">
          <Button
            variant="danger"
            onClick={onRemove}
            disabled={!canRemove}
            className="w-full px-3 py-2 text-xs md:w-auto"
          >
            X
          </Button>
        </div>
      </div>
    </div>
  );
}
