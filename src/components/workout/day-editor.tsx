"use client";

import type { WorkoutDay, Exercise } from "@/types/workout";
import { ExerciseRow } from "@/components/workout/exercise-row";
import { InputField } from "@/components/ui/input-field";
import { MuscleGroupSelect } from "@/components/workout/muscle-group-select";
import { Button } from "@/components/ui/button";
import { createExercise } from "@/lib/plan-factory";

interface DayEditorProps {
  day: WorkoutDay;
  onChange: (updated: WorkoutDay) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function DayEditor({ day, onChange, onRemove, canRemove }: DayEditorProps) {
  function handleMuscleGroupChange(value: string) {
    onChange({ ...day, muscleGroup: value });
  }

  function handleExerciseChange(index: number, updated: Exercise) {
    const exercises = [...day.exercises];
    exercises[index] = updated;
    onChange({ ...day, exercises });
  }

  function handleAddExercise() {
    onChange({
      ...day,
      exercises: [...day.exercises, createExercise()],
    });
  }

  function handleRemoveExercise(index: number) {
    const exercises = day.exercises.filter((_, i) => i !== index);
    onChange({ ...day, exercises });
  }

  function handleCardioChange(field: "description" | "note", value: string) {
    onChange({
      ...day,
      cardio: { ...day.cardio, [field]: value },
    });
  }

  return (
    <div className="rounded-lg border border-pt-border bg-pt-card/50 p-3 sm:p-6">
      {/* Day Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="w-fit rounded-md bg-pt-accent px-3 py-1 text-sm font-bold text-black">
            {day.dayLabel}
          </span>
          <MuscleGroupSelect
            value={day.muscleGroup}
            onChange={handleMuscleGroupChange}
          />
        </div>
        <Button
          variant="danger"
          onClick={onRemove}
          disabled={!canRemove}
          className="w-fit text-xs"
        >
          Eliminar Dia
        </Button>
      </div>

      {/* Exercise Rows */}
      <div className="space-y-3">
        {day.exercises.map((exercise, index) => (
          <ExerciseRow
            key={exercise.id}
            exercise={exercise}
            muscleGroup={day.muscleGroup}
            onChange={(updated) => handleExerciseChange(index, updated)}
            onRemove={() => handleRemoveExercise(index)}
            canRemove={day.exercises.length > 1}
          />
        ))}
      </div>

      <div className="mt-4">
        <Button variant="secondary" onClick={handleAddExercise}>
          + Agregar Ejercicio
        </Button>
      </div>

      {/* Cardio Section */}
      <div className="mt-6 border-t border-pt-border pt-4">
        <h4 className="mb-3 text-sm font-bold text-pt-accent uppercase tracking-wide">
          Cardio
        </h4>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <InputField
            label="Descripcion"
            value={day.cardio.description}
            onChange={(v) => handleCardioChange("description", v)}
            placeholder="ej: caminadora 5 minutos velocidad 8"
          />
          <InputField
            label="Nota"
            value={day.cardio.note}
            onChange={(v) => handleCardioChange("note", v)}
            placeholder="Nota para el alumno"
          />
        </div>
      </div>
    </div>
  );
}
