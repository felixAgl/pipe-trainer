import { generateId } from "@/lib/utils";
import { DEFAULT_CARDIO, DEFAULT_EXERCISE } from "@/types/workout";
import type {
  Exercise,
  WorkoutDay,
  WorkoutWeek,
  WorkoutPlan,
} from "@/types/workout";

export function createExercise(overrides?: Partial<Exercise>): Exercise {
  return {
    id: generateId(),
    ...DEFAULT_EXERCISE,
    ...overrides,
  };
}

export function createWorkoutDay(
  dayNumber: number,
  overrides?: Partial<WorkoutDay>
): WorkoutDay {
  return {
    id: generateId(),
    dayNumber,
    dayLabel: `Dia ${dayNumber}`,
    muscleGroup: "",
    exercises: [createExercise()],
    cardio: { ...DEFAULT_CARDIO },
    ...overrides,
  };
}

export function createWorkoutWeek(
  weekNumber: number,
  daysCount: number = 5
): WorkoutWeek {
  return {
    id: generateId(),
    weekNumber,
    days: Array.from({ length: daysCount }, (_, i) =>
      createWorkoutDay(i + 1)
    ),
  };
}

export function createWorkoutPlan(
  weeksCount: number = 1,
  daysPerWeek: number = 5
): WorkoutPlan {
  return {
    id: generateId(),
    title: "Plan de Entrenamiento",
    weeks: Array.from({ length: weeksCount }, (_, i) =>
      createWorkoutWeek(i + 1, daysPerWeek)
    ),
    createdAt: new Date().toISOString(),
  };
}
