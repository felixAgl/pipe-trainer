import { describe, it, expect } from "vitest";
import {
  createExercise,
  createWorkoutDay,
  createWorkoutWeek,
  createWorkoutPlan,
} from "@/lib/plan-factory";

describe("createExercise", () => {
  it("should create an exercise with default values", () => {
    const exercise = createExercise();
    expect(exercise.id).toBeTruthy();
    expect(exercise.name).toBe("");
    expect(exercise.series).toBe(3);
    expect(exercise.reps).toBe(10);
    expect(exercise.restTime).toBe("2 MIN");
    expect(exercise.rir).toBe(2);
    expect(exercise.rpe).toBe(8);
  });

  it("should accept overrides", () => {
    const exercise = createExercise({ name: "Sentadilla", series: 5 });
    expect(exercise.name).toBe("Sentadilla");
    expect(exercise.series).toBe(5);
  });

  it("should generate unique IDs", () => {
    const ex1 = createExercise();
    const ex2 = createExercise();
    expect(ex1.id).not.toBe(ex2.id);
  });
});

describe("createWorkoutDay", () => {
  it("should create a day with correct day number", () => {
    const day = createWorkoutDay(3);
    expect(day.dayNumber).toBe(3);
    expect(day.dayLabel).toBe("Dia 3");
  });

  it("should start with one empty exercise", () => {
    const day = createWorkoutDay(1);
    expect(day.exercises).toHaveLength(1);
  });

  it("should have default cardio note", () => {
    const day = createWorkoutDay(1);
    expect(day.cardio.note).toContain("No te saltes el cardio");
  });

  it("should have empty muscle group by default", () => {
    const day = createWorkoutDay(1);
    expect(day.muscleGroup).toBe("");
  });
});

describe("createWorkoutWeek", () => {
  it("should create a week with 5 days by default", () => {
    const week = createWorkoutWeek(1);
    expect(week.weekNumber).toBe(1);
    expect(week.days).toHaveLength(5);
  });

  it("should accept custom days count", () => {
    const week = createWorkoutWeek(2, 3);
    expect(week.days).toHaveLength(3);
  });

  it("should number days sequentially", () => {
    const week = createWorkoutWeek(1);
    week.days.forEach((day, i) => {
      expect(day.dayNumber).toBe(i + 1);
      expect(day.dayLabel).toBe(`Dia ${i + 1}`);
    });
  });
});

describe("createWorkoutPlan", () => {
  it("should create a plan with 1 week by default", () => {
    const plan = createWorkoutPlan();
    expect(plan.weeks).toHaveLength(1);
  });

  it("should create a plan with specified weeks", () => {
    const plan = createWorkoutPlan(3, 4);
    expect(plan.weeks).toHaveLength(3);
    plan.weeks.forEach((week) => {
      expect(week.days).toHaveLength(4);
    });
  });

  it("should number weeks sequentially", () => {
    const plan = createWorkoutPlan(3);
    plan.weeks.forEach((week, i) => {
      expect(week.weekNumber).toBe(i + 1);
    });
  });

  it("should include a createdAt timestamp", () => {
    const plan = createWorkoutPlan();
    expect(plan.createdAt).toBeTruthy();
    expect(() => new Date(plan.createdAt)).not.toThrow();
  });
});
