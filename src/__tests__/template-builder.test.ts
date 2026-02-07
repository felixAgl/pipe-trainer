import { describe, it, expect } from "vitest";
import { buildWorkoutDayHTML, buildWorkoutDayCSS } from "@/lib/template-builder";
import type { WorkoutDay } from "@/types/workout";

const MOCK_DAY: WorkoutDay = {
  id: "test-day-1",
  dayNumber: 1,
  dayLabel: "Dia 1",
  muscleGroup: "PIERNA",
  exercises: [
    {
      id: "ex-1",
      name: "Sentadilla hack",
      series: 3,
      reps: 6,
      restTime: "2-3 MIN",
      rir: 2,
      rpe: 8,
    },
    {
      id: "ex-2",
      name: "Prensa",
      series: 4,
      reps: 12,
      restTime: "1 MIN",
      rir: 2,
      rpe: 8,
    },
  ],
  cardio: {
    description: "caminadora 5 minutos velocidad 8",
    note: "No te saltes el cardio, es un complemento importante para tu proceso.",
  },
};

describe("buildWorkoutDayHTML", () => {
  it("should generate HTML containing the plan title", () => {
    const html = buildWorkoutDayHTML(MOCK_DAY, { weekNumber: 1 });
    expect(html).toContain("PLAN DE ENTRENAMIENTO");
  });

  it("should include the week number", () => {
    const html = buildWorkoutDayHTML(MOCK_DAY, { weekNumber: 3 });
    expect(html).toContain("SEMANA 3");
  });

  it("should include the day label and muscle group", () => {
    const html = buildWorkoutDayHTML(MOCK_DAY, { weekNumber: 1 });
    expect(html).toContain("Dia 1");
    expect(html).toContain("PIERNA");
  });

  it("should include all exercise names", () => {
    const html = buildWorkoutDayHTML(MOCK_DAY, { weekNumber: 1 });
    expect(html).toContain("Sentadilla hack");
    expect(html).toContain("Prensa");
  });

  it("should include exercise details (series, reps, rest, rir, rpe)", () => {
    const html = buildWorkoutDayHTML(MOCK_DAY, { weekNumber: 1 });
    // First exercise
    expect(html).toContain(">3<");
    expect(html).toContain(">6<");
    expect(html).toContain("2-3 MIN");
    expect(html).toContain(">2<");
    expect(html).toContain(">8<");
  });

  it("should include the cardio section", () => {
    const html = buildWorkoutDayHTML(MOCK_DAY, { weekNumber: 1 });
    expect(html).toContain("CARDIO");
    expect(html).toContain("caminadora 5 minutos velocidad 8");
  });

  it("should include the note", () => {
    const html = buildWorkoutDayHTML(MOCK_DAY, { weekNumber: 1 });
    expect(html).toContain("NOTA:");
    expect(html).toContain("No te saltes el cardio");
  });

  it("should use the brand color #ccff00", () => {
    const html = buildWorkoutDayHTML(MOCK_DAY, { weekNumber: 1 });
    expect(html).toContain("#ccff00");
  });

  it("should use the dark background #0a0a0a", () => {
    const html = buildWorkoutDayHTML(MOCK_DAY, { weekNumber: 1 });
    expect(html).toContain("#0a0a0a");
  });

  it("should include the PT logo text", () => {
    const html = buildWorkoutDayHTML(MOCK_DAY, { weekNumber: 1 });
    expect(html).toContain(">PT<");
  });

  it("should generate table headers in correct order", () => {
    const html = buildWorkoutDayHTML(MOCK_DAY, { weekNumber: 1 });
    const headersOrder = ["Ejercicios", "Series", "Reps", "Tiempo", "Descanso", "RIR", "RPE"];
    headersOrder.forEach((header) => {
      expect(html).toContain(header);
    });
  });

  it("should use green borders on table cells", () => {
    const html = buildWorkoutDayHTML(MOCK_DAY, { weekNumber: 1 });
    expect(html).toContain("border: 1px solid #ccff00");
  });

  it("should include the coach watermark footer", () => {
    const html = buildWorkoutDayHTML(MOCK_DAY, { weekNumber: 1 });
    expect(html).toContain("Pipetrainer_11");
  });

  it("should allow custom coach handle", () => {
    const html = buildWorkoutDayHTML(MOCK_DAY, {
      weekNumber: 1,
      coachHandle: "MyCoach_99",
    });
    expect(html).toContain("MyCoach_99");
  });
});

describe("buildWorkoutDayCSS", () => {
  it("should return CSS with dark background", () => {
    const css = buildWorkoutDayCSS();
    expect(css).toContain("#0a0a0a");
  });

  it("should reset margins and padding", () => {
    const css = buildWorkoutDayCSS();
    expect(css).toContain("margin: 0");
    expect(css).toContain("padding: 0");
  });
});
