import type { WorkoutDay } from "@/types/workout";
import { PT_ISOTIPO_DATA_URL } from "@/lib/brand-assets";

interface WorkoutDayCardProps {
  day: WorkoutDay;
  weekNumber: number;
  coachHandle?: string;
}

export function WorkoutDayCard({
  day,
  weekNumber,
  coachHandle = "Pipetrainer_11",
}: WorkoutDayCardProps) {
  return (
    <div
      className="flex min-h-[1920px] w-[1080px] flex-col font-sans text-white"
      style={{
        background:
          "linear-gradient(to bottom, #0a0a0a 0%, #0a0a0a 30%, #181818 45%, #282828 58%, #333333 70%, #2a2a2a 80%, #1a1a1a 92%, #0f0f0f 100%)",
      }}
    >
      {/* Header: Logo + Title */}
      <div className="flex flex-col items-center px-10 pt-8 pb-2">
        {/* PT Isotipo Logo */}
        <div className="mb-1 self-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PT_ISOTIPO_DATA_URL}
            alt="PT"
            style={{ height: 60, width: "auto" }}
          />
        </div>

        {/* Plan Title */}
        <h1 className="text-center text-[28px] font-black italic tracking-wider text-pt-accent uppercase">
          PLAN DE ENTRENAMIENTO
        </h1>
        <h2 className="mt-1 text-center text-[22px] font-black italic tracking-widest text-pt-accent uppercase">
          SEMANA {weekNumber}
        </h2>
      </div>

      {/* Day Bar - White bg for day, green for muscle group */}
      <div className="mx-10 mt-3 flex items-stretch">
        <div className="flex items-center bg-white px-5 py-2.5">
          <span className="text-base font-bold text-black whitespace-nowrap">
            {day.dayLabel}
          </span>
        </div>
        <div className="flex items-center justify-center bg-pt-accent px-8 py-2.5">
          <span className="text-lg font-extrabold tracking-wider text-black uppercase">
            {day.muscleGroup}
          </span>
        </div>
      </div>

      {/* Exercise Table */}
      <div className="mx-10 mt-5">
        {/* Table Header - GREEN bg, black text, white thick borders */}
        <div className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr_0.8fr_0.8fr] border-2 border-white bg-pt-accent text-center">
          <div className="border-2 border-white px-4 py-3 text-center">
            <span className="text-[13px] font-extrabold tracking-wide text-black uppercase">
              Ejercicios
            </span>
          </div>
          <div className="border-2 border-white px-2 py-3">
            <span className="text-[13px] font-extrabold tracking-wide text-black uppercase">
              Series
            </span>
          </div>
          <div className="border-2 border-white px-2 py-3">
            <span className="text-[13px] font-extrabold tracking-wide text-black uppercase">
              Reps
            </span>
          </div>
          <div className="border-2 border-white px-2 py-3">
            <span className="text-[11px] font-extrabold leading-tight tracking-wide text-black uppercase">
              Tiempo
              <br />
              Descanso
            </span>
          </div>
          <div className="border-2 border-white px-2 py-3">
            <span className="text-[13px] font-extrabold tracking-wide text-black uppercase">
              RIR
            </span>
          </div>
          <div className="border-2 border-white px-2 py-3">
            <span className="text-[13px] font-extrabold tracking-wide text-black uppercase">
              RPE
            </span>
          </div>
        </div>

        {/* Table Rows - white thick borders */}
        {day.exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr_0.8fr_0.8fr] text-center"
          >
            <div className="flex items-center justify-center border-2 border-white px-4 py-3.5">
              <span className="text-[15px] text-white">{exercise.name}</span>
            </div>
            <div className="flex items-center justify-center border-2 border-white px-2 py-3.5">
              <span className="text-[15px] text-white">{exercise.series}</span>
            </div>
            <div className="flex items-center justify-center border-2 border-white px-2 py-3.5">
              <span className="text-[15px] text-white">{exercise.reps}</span>
            </div>
            <div className="flex items-center justify-center border-2 border-white px-2 py-3.5">
              <span className="text-[15px] text-white">
                {exercise.restTime}
              </span>
            </div>
            <div className="flex items-center justify-center border-2 border-white px-2 py-3.5">
              <span className="text-[15px] text-white">{exercise.rir}</span>
            </div>
            <div className="flex items-center justify-center border-2 border-white px-2 py-3.5">
              <span className="text-[15px] text-white">{exercise.rpe}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Spacer to push cardio toward bottom */}
      <div className="min-h-10 flex-1" />

      {/* Cardio Section */}
      <div className="mx-10 mb-4 flex flex-col items-center">
        {/* Glowing CARDIO title - WHITE text with white glow */}
        <h3
          className="mb-5 text-4xl font-black tracking-widest text-white uppercase"
          style={{
            textShadow:
              "0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(255,255,255,0.2)",
          }}
        >
          CARDIO
        </h3>

        {/* Cardio Description Box - WHITE solid border */}
        <div className="min-h-[100px] w-full rounded-sm border-2 border-solid border-white px-6 py-5">
          <p className="text-base text-white">{day.cardio.description}</p>
        </div>
      </div>

      {/* Note */}
      <div className="mx-10 mt-4 mb-4">
        <p className="text-sm leading-relaxed text-pt-muted">
          <span className="font-bold text-white">NOTA:</span>{" "}
          {day.cardio.note}
        </p>
      </div>

      {/* Watermark Footer */}
      <div className="py-4 px-10 text-center">
        <span className="text-sm tracking-wide text-neutral-600">
          {coachHandle}
        </span>
      </div>
    </div>
  );
}
