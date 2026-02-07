import type { WorkoutDay } from "@/types/workout";

interface TemplateOptions {
  weekNumber: number;
  coachHandle?: string;
}

export function buildWorkoutDayHTML(
  day: WorkoutDay,
  options: TemplateOptions
): string {
  const handle = options.coachHandle ?? "Pipetrainer_11";

  const exerciseRows = day.exercises
    .map(
      (exercise) => `
      <tr>
        <td style="padding: 14px 16px; text-align: center; border: 1px solid #ccff00; color: #fff; font-size: 15px;">${exercise.name}</td>
        <td style="padding: 14px 8px; text-align: center; border: 1px solid #ccff00; color: #fff; font-size: 15px;">${exercise.series}</td>
        <td style="padding: 14px 8px; text-align: center; border: 1px solid #ccff00; color: #fff; font-size: 15px;">${exercise.reps}</td>
        <td style="padding: 14px 8px; text-align: center; border: 1px solid #ccff00; color: #fff; font-size: 15px;">${exercise.restTime}</td>
        <td style="padding: 14px 8px; text-align: center; border: 1px solid #ccff00; color: #fff; font-size: 15px;">${exercise.rir}</td>
        <td style="padding: 14px 8px; text-align: center; border: 1px solid #ccff00; color: #fff; font-size: 15px;">${exercise.rpe}</td>
      </tr>`
    )
    .join("");

  return `
    <div style="width: 1080px; min-height: 1920px; font-family: 'Inter', Arial, sans-serif; background: linear-gradient(to bottom, #0a0a0a 0%, #0a0a0a 40%, #1a1a1a 60%, #222222 72%, #1a1a1a 85%, #0f0f0f 100%); color: #fff; padding: 0; margin: 0; display: flex; flex-direction: column;">

      <!-- Header -->
      <div style="padding: 32px 40px 8px 40px; display: flex; flex-direction: column; align-items: center;">
        <div style="align-self: flex-start; margin-bottom: 4px;">
          <span style="font-size: 38px; font-weight: 900; font-style: italic; color: #ccff00; letter-spacing: -1px;">PT</span>
        </div>
        <h1 style="text-align: center; font-size: 28px; font-weight: 900; font-style: italic; color: #ccff00; margin: 0; letter-spacing: 2px; text-transform: uppercase;">
          PLAN DE ENTRENAMIENTO
        </h1>
        <h2 style="text-align: center; font-size: 22px; font-weight: 900; font-style: italic; color: #ccff00; margin: 4px 0 0 0; letter-spacing: 3px; text-transform: uppercase;">
          SEMANA ${options.weekNumber}
        </h2>
      </div>

      <!-- Day Bar -->
      <div style="margin: 12px 40px 0 40px; display: flex; align-items: stretch;">
        <div style="background: #1a1a1a; padding: 10px 20px; display: flex; align-items: center; border: 1px solid #333;">
          <span style="font-size: 16px; font-weight: 700; color: #fff; white-space: nowrap;">${day.dayLabel}</span>
        </div>
        <div style="background: #ccff00; padding: 10px 32px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 18px; font-weight: 800; color: #000; text-transform: uppercase; letter-spacing: 2px;">${day.muscleGroup}</span>
        </div>
      </div>

      <!-- Exercise Table -->
      <div style="margin: 20px 40px 0 40px;">
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccff00;">
          <thead>
            <tr>
              <th style="padding: 12px 16px; text-align: center; border: 1px solid #ccff00; font-size: 13px; font-weight: 800; color: #ccff00; text-transform: uppercase; letter-spacing: 1px; width: 30%;">Ejercicios</th>
              <th style="padding: 12px 8px; text-align: center; border: 1px solid #ccff00; font-size: 13px; font-weight: 800; color: #ccff00; text-transform: uppercase; letter-spacing: 1px; width: 11%;">Series</th>
              <th style="padding: 12px 8px; text-align: center; border: 1px solid #ccff00; font-size: 13px; font-weight: 800; color: #ccff00; text-transform: uppercase; letter-spacing: 1px; width: 11%;">Reps</th>
              <th style="padding: 12px 8px; text-align: center; border: 1px solid #ccff00; font-size: 11px; font-weight: 800; color: #ccff00; text-transform: uppercase; letter-spacing: 1px; width: 18%; line-height: 1.3;">Tiempo<br>Descanso</th>
              <th style="padding: 12px 8px; text-align: center; border: 1px solid #ccff00; font-size: 13px; font-weight: 800; color: #ccff00; text-transform: uppercase; letter-spacing: 1px; width: 10%;">RIR</th>
              <th style="padding: 12px 8px; text-align: center; border: 1px solid #ccff00; font-size: 13px; font-weight: 800; color: #ccff00; text-transform: uppercase; letter-spacing: 1px; width: 10%;">RPE</th>
            </tr>
          </thead>
          <tbody>
            ${exerciseRows}
          </tbody>
        </table>
      </div>

      <!-- Spacer to push cardio toward bottom -->
      <div style="flex: 1; min-height: 40px;"></div>

      <!-- Cardio Section -->
      <div style="margin: 0 40px 16px 40px; display: flex; flex-direction: column; align-items: center;">
        <h3 style="font-size: 36px; font-weight: 900; color: #ccff00; text-transform: uppercase; letter-spacing: 8px; margin: 0 0 20px 0; text-shadow: 0 0 20px rgba(204,255,0,0.8), 0 0 40px rgba(204,255,0,0.4), 0 0 80px rgba(204,255,0,0.2);">
          CARDIO
        </h3>
        <div style="width: 100%; border: 2px solid #ccff00; border-radius: 4px; padding: 20px 24px; min-height: 100px;">
          <p style="font-size: 16px; color: #fff; margin: 0;">${day.cardio.description}</p>
        </div>
      </div>

      <!-- Note -->
      <div style="margin: 16px 40px 16px 40px;">
        <p style="font-size: 14px; color: #a0a0a0; line-height: 1.6; margin: 0;">
          <span style="font-weight: 700; color: #fff;">NOTA:</span> ${day.cardio.note}
        </p>
      </div>

      <!-- Watermark Footer -->
      <div style="padding: 16px 40px 24px 40px; text-align: center;">
        <span style="font-size: 14px; color: #555; letter-spacing: 1px;">${handle}</span>
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
