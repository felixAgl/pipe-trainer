import type { WorkoutDay } from "@/types/workout";

interface TemplateOptions {
  weekNumber: number;
}

export function buildWorkoutDayHTML(
  day: WorkoutDay,
  options: TemplateOptions
): string {
  const exerciseRows = day.exercises
    .map(
      (exercise, index) => `
      <tr style="background: ${index % 2 === 0 ? "#0a0a0a" : "rgba(26,26,26,0.3)"}; border-bottom: 1px solid #333;">
        <td style="padding: 16px; text-align: left; border-right: 1px solid #333; color: #fff; font-size: 16px;">${exercise.name}</td>
        <td style="padding: 16px; text-align: center; border-right: 1px solid #333; color: #fff; font-size: 16px;">${exercise.series}</td>
        <td style="padding: 16px; text-align: center; border-right: 1px solid #333; color: #fff; font-size: 16px;">${exercise.reps}</td>
        <td style="padding: 16px; text-align: center; border-right: 1px solid #333; color: #fff; font-size: 16px;">${exercise.restTime}</td>
        <td style="padding: 16px; text-align: center; border-right: 1px solid #333; color: #fff; font-size: 16px;">${exercise.rir}</td>
        <td style="padding: 16px; text-align: center; color: #fff; font-size: 16px;">${exercise.rpe}</td>
      </tr>`
    )
    .join("");

  return `
    <div style="width: 1080px; font-family: 'Inter', Arial, sans-serif; background: #0a0a0a; color: #fff; padding: 0; margin: 0;">

      <!-- Header -->
      <div style="padding: 32px 40px 16px 40px; display: flex; flex-direction: column; align-items: center;">
        <div style="align-self: flex-start; margin-bottom: 8px;">
          <span style="font-size: 36px; font-weight: 900; font-style: italic; color: #ccff00;">PT</span>
        </div>
        <h1 style="text-align: center; font-size: 30px; font-weight: 900; font-style: italic; color: #ccff00; margin: 0; letter-spacing: 1px;">
          PLAN DE ENTRENAMIENTO
        </h1>
        <h2 style="text-align: center; font-size: 24px; font-weight: 900; font-style: italic; color: #ccff00; margin: 4px 0 0 0; letter-spacing: 2px;">
          SEMANA ${options.weekNumber}
        </h2>
      </div>

      <!-- Day Bar -->
      <div style="margin: 16px 40px 0 40px; display: flex; border-radius: 6px; overflow: hidden;">
        <div style="background: #fff; padding: 12px 24px; display: flex; align-items: center;">
          <span style="font-size: 18px; font-weight: 700; color: #000; white-space: nowrap;">${day.dayLabel}</span>
        </div>
        <div style="background: #ccff00; flex: 1; display: flex; align-items: center; justify-content: center; padding: 12px 24px;">
          <span style="font-size: 20px; font-weight: 800; color: #000; text-transform: uppercase; letter-spacing: 2px;">${day.muscleGroup}</span>
        </div>
      </div>

      <!-- Exercise Table -->
      <div style="margin: 24px 40px 0 40px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #ccff00;">
              <th style="padding: 12px 16px; text-align: left; border-right: 1px solid rgba(0,0,0,0.2); font-size: 13px; font-weight: 800; color: #000; text-transform: uppercase; letter-spacing: 1px; width: 30%;">Ejercicios</th>
              <th style="padding: 12px 8px; text-align: center; border-right: 1px solid rgba(0,0,0,0.2); font-size: 13px; font-weight: 800; color: #000; text-transform: uppercase; letter-spacing: 1px; width: 12%;">Series</th>
              <th style="padding: 12px 8px; text-align: center; border-right: 1px solid rgba(0,0,0,0.2); font-size: 13px; font-weight: 800; color: #000; text-transform: uppercase; letter-spacing: 1px; width: 12%;">Reps</th>
              <th style="padding: 12px 8px; text-align: center; border-right: 1px solid rgba(0,0,0,0.2); font-size: 11px; font-weight: 800; color: #000; text-transform: uppercase; letter-spacing: 1px; width: 18%; line-height: 1.3;">Tiempo<br>Descanso</th>
              <th style="padding: 12px 8px; text-align: center; border-right: 1px solid rgba(0,0,0,0.2); font-size: 13px; font-weight: 800; color: #000; text-transform: uppercase; letter-spacing: 1px; width: 10%;">RIR</th>
              <th style="padding: 12px 8px; text-align: center; font-size: 13px; font-weight: 800; color: #000; text-transform: uppercase; letter-spacing: 1px; width: 10%;">RPE</th>
            </tr>
          </thead>
          <tbody>
            ${exerciseRows}
          </tbody>
        </table>
      </div>

      <!-- Cardio Section -->
      <div style="margin: 48px 40px 16px 40px; display: flex; flex-direction: column; align-items: center;">
        <h3 style="font-size: 36px; font-weight: 900; color: #fff; text-transform: uppercase; letter-spacing: 8px; margin: 0 0 24px 0; text-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(255,255,255,0.2);">
          CARDIO
        </h3>
        <div style="width: 100%; border: 2px dashed rgba(255,255,255,0.6); border-radius: 4px; padding: 20px 24px;">
          <p style="font-size: 18px; color: #fff; font-style: italic; margin: 0;">${day.cardio.description}</p>
        </div>
      </div>

      <!-- Note -->
      <div style="margin: 24px 40px 40px 40px;">
        <p style="font-size: 14px; color: #a0a0a0; line-height: 1.6; margin: 0;">
          <span style="font-weight: 700; color: #fff;">NOTA:</span> ${day.cardio.note}
        </p>
      </div>
    </div>
  `;
}

export function buildWorkoutDayCSS(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background: #0a0a0a;
      margin: 0;
      padding: 0;
    }
  `;
}
