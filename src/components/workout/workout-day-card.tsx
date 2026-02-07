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
      className="flex h-[1920px] w-[1080px] flex-col font-sans text-white"
      style={{
        background:
          "linear-gradient(to bottom, #0a0a0a 0%, #0a0a0a 25%, #151515 40%, #222222 55%, #333333 68%, #2a2a2a 80%, #1a1a1a 92%, #0f0f0f 100%)",
      }}
    >
      {/* Header: Logo + Title */}
      <div className="flex flex-col items-center px-14 pt-12 pb-4">
        {/* PT Isotipo Logo */}
        <div className="mb-3 self-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PT_ISOTIPO_DATA_URL}
            alt="PT"
            style={{ height: 90, width: "auto" }}
          />
        </div>

        {/* Plan Title - with glow effect */}
        <h1
          className="text-center text-[44px] font-black italic leading-tight tracking-wider text-pt-accent uppercase"
          style={{
            textShadow:
              "0 0 20px rgba(219,254,83,0.6), 0 0 40px rgba(219,254,83,0.3), 0 0 80px rgba(219,254,83,0.15)",
          }}
        >
          PLAN DE
          <br />
          ENTRENAMIENTO
        </h1>
        <h2
          className="mt-2 text-center text-[34px] font-black italic tracking-widest text-pt-accent uppercase"
          style={{
            textShadow:
              "0 0 15px rgba(219,254,83,0.5), 0 0 30px rgba(219,254,83,0.25)",
          }}
        >
          SEMANA {weekNumber}
        </h2>
      </div>

      {/* Day Bar - White bg for day, green for muscle group */}
      <div className="mx-14 mt-4 flex items-stretch">
        <div className="flex items-center bg-white px-7 py-4">
          <span className="text-[22px] font-bold text-black whitespace-nowrap">
            {day.dayLabel}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center bg-pt-accent px-10 py-4">
          <span className="text-[26px] font-extrabold tracking-wider text-black uppercase">
            {day.muscleGroup}
          </span>
        </div>
      </div>

      {/* Exercise Table */}
      <div className="mx-14 mt-6">
        {/* Table Header - GREEN bg, black text, white thick borders */}
        <div className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr_0.8fr_0.8fr] border-[3px] border-white bg-pt-accent text-center">
          <div className="border-[3px] border-white px-4 py-4 text-center">
            <span className="text-[20px] font-extrabold tracking-wide text-black uppercase">
              Ejercicios
            </span>
          </div>
          <div className="border-[3px] border-white px-2 py-4">
            <span className="text-[20px] font-extrabold tracking-wide text-black uppercase">
              Series
            </span>
          </div>
          <div className="border-[3px] border-white px-2 py-4">
            <span className="text-[20px] font-extrabold tracking-wide text-black uppercase">
              Reps
            </span>
          </div>
          <div className="border-[3px] border-white px-2 py-4">
            <span className="text-[16px] font-extrabold leading-tight tracking-wide text-black uppercase">
              Tiempo
              <br />
              Descanso
            </span>
          </div>
          <div className="border-[3px] border-white px-2 py-4">
            <span className="text-[20px] font-extrabold tracking-wide text-black uppercase">
              RIR
            </span>
          </div>
          <div className="border-[3px] border-white px-2 py-4">
            <span className="text-[20px] font-extrabold tracking-wide text-black uppercase">
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
            <div className="flex items-center justify-center border-[3px] border-white px-4 py-5">
              <span className="text-[22px] font-medium text-white">
                {exercise.name}
              </span>
            </div>
            <div className="flex items-center justify-center border-[3px] border-white px-2 py-5">
              <span className="text-[22px] font-bold text-white">
                {exercise.series}
              </span>
            </div>
            <div className="flex items-center justify-center border-[3px] border-white px-2 py-5">
              <span className="text-[22px] font-bold text-white">
                {exercise.reps}
              </span>
            </div>
            <div className="flex items-center justify-center border-[3px] border-white px-2 py-5">
              <span className="text-[22px] font-bold text-white">
                {exercise.restTime}
              </span>
            </div>
            <div className="flex items-center justify-center border-[3px] border-white px-2 py-5">
              <span className="text-[22px] font-bold text-white">
                {exercise.rir}
              </span>
            </div>
            <div className="flex items-center justify-center border-[3px] border-white px-2 py-5">
              <span className="text-[22px] font-bold text-white">
                {exercise.rpe}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Spacer to push cardio toward bottom */}
      <div className="min-h-8 flex-1" />

      {/* Cardio Section */}
      <div className="mx-14 mb-6 flex flex-col items-center">
        {/* Glowing CARDIO title - WHITE text with white glow */}
        <h3
          className="mb-6 text-[56px] font-black italic tracking-widest text-white uppercase"
          style={{
            textShadow:
              "0 0 30px rgba(255,255,255,0.9), 0 0 60px rgba(255,255,255,0.5), 0 0 100px rgba(255,255,255,0.25)",
          }}
        >
          CARDIO
        </h3>

        {/* Cardio Description Box - WHITE solid border */}
        <div className="min-h-[140px] w-full rounded-sm border-[3px] border-solid border-white px-8 py-6">
          <p className="text-[22px] leading-relaxed text-white">
            {day.cardio.description}
          </p>
        </div>
      </div>

      {/* Note */}
      <div className="mx-14 mt-4 mb-6">
        <p className="text-[20px] leading-relaxed text-pt-muted">
          <span className="font-bold text-white">NOTA:</span>{" "}
          {day.cardio.note}
        </p>
      </div>

      {/* Watermark Footer */}
      <div className="py-6 px-14 text-center">
        <span className="text-[18px] tracking-widest text-neutral-500">
          {coachHandle}
        </span>
      </div>
    </div>
  );
}
