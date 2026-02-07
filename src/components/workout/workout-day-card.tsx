import type { WorkoutDay } from "@/types/workout";
import { PT_ISOTIPO_DATA_URL } from "@/lib/brand-assets";

interface WorkoutDayCardProps {
  day: WorkoutDay;
  weekNumber: number;
  coachHandle?: string;
}

const GLOW_GREEN =
  "0 0 8px rgba(219,254,83,1), 0 0 16px rgba(219,254,83,0.85), 0 0 32px rgba(219,254,83,0.6), 0 0 60px rgba(219,254,83,0.35), 0 0 80px rgba(219,254,83,0.15)";

const GLOW_WHITE =
  "0 0 10px rgba(255,255,255,1), 0 0 25px rgba(255,255,255,0.9), 0 0 50px rgba(255,255,255,0.6), 0 0 100px rgba(255,255,255,0.3)";

export function WorkoutDayCard({
  day,
  weekNumber,
  coachHandle = "Pipetrainer_11",
}: WorkoutDayCardProps) {
  return (
    <div
      className="flex h-[1920px] w-[1080px] flex-col font-sans text-white"
      style={{
        background: [
          "radial-gradient(ellipse 90% 50% at 50% 55%, rgba(62,56,48,0.55) 0%, rgba(46,42,38,0.35) 30%, rgba(30,27,24,0.15) 60%, transparent 100%)",
          "linear-gradient(to bottom, #0a0a0a 0%, #0a0a0a 20%, #141312 35%, #1e1b18 48%, #2a2622 58%, #2a2622 65%, #1e1b18 78%, #111010 90%, #0a0a0a 100%)",
        ].join(", "),
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

        {/* Plan Title - STRONG neon glow */}
        <h1
          className="text-center text-[44px] font-black italic leading-tight tracking-wider text-pt-accent uppercase"
          style={{ textShadow: GLOW_GREEN }}
        >
          PLAN DE
          <br />
          ENTRENAMIENTO
        </h1>
        <h2
          className="mt-2 text-center text-[34px] font-black italic tracking-widest text-pt-accent uppercase"
          style={{ textShadow: GLOW_GREEN }}
        >
          SEMANA {weekNumber}
        </h2>
      </div>

      {/* Day Bar - White fills into green arrow point on left */}
      <div className="relative mx-14 mt-4 flex h-[66px]">
        {/* White rectangle extends into the green arrow gap */}
        <div className="flex items-center bg-white px-10 pr-14" style={{ marginRight: -34 }}>
          <span className="text-[24px] font-bold text-black whitespace-nowrap">
            {day.dayLabel}
          </span>
        </div>
        {/* Green section - arrow/chevron point on left, flat on right */}
        <div
          className="relative z-10 flex items-center justify-center pl-12 pr-10"
          style={{
            backgroundColor: "#DBFE53",
            clipPath:
              "polygon(34px 0, 100% 0, 100% 100%, 34px 100%, 0 50%)",
          }}
        >
          <span className="ml-4 text-[28px] font-extrabold tracking-wider text-black uppercase">
            {day.muscleGroup}
          </span>
        </div>
      </div>

      {/* Exercise Table */}
      <div className="mx-14 mt-8">
        {/* Table Header - GREEN bg, black text, white borders */}
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
            <span className="text-[17px] font-extrabold leading-tight tracking-wide text-black uppercase">
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

        {/* Table Rows */}
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
              <span className="text-[22px] font-bold text-pt-accent">
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
        {/* Glowing CARDIO title - STRONG white neon glow */}
        <h3
          className="mb-6 text-[56px] font-black italic tracking-widest text-white uppercase"
          style={{ textShadow: GLOW_WHITE }}
        >
          CARDIO
        </h3>

        {/* Cardio Description Box */}
        <div className="min-h-[140px] w-full rounded-sm border-[3px] border-solid border-white px-8 py-6">
          <p className="text-[22px] leading-relaxed text-white">
            {day.cardio.description}
          </p>
        </div>
      </div>

      {/* Note */}
      <div className="mx-14 mt-2 mb-6">
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
