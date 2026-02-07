import type { WorkoutDay } from "@/types/workout";

interface WorkoutDayCardProps {
  day: WorkoutDay;
  weekNumber: number;
}

export function WorkoutDayCard({ day, weekNumber }: WorkoutDayCardProps) {
  return (
    <div className="flex w-[1080px] flex-col bg-pt-dark font-sans text-white">
      {/* Header: Logo + Title */}
      <div className="flex flex-col items-center px-10 pt-8 pb-4">
        {/* PT Logo */}
        <div className="mb-2 self-start">
          <span className="text-4xl font-black italic text-pt-accent">PT</span>
        </div>

        {/* Plan Title */}
        <h1 className="text-center text-3xl font-black italic text-pt-accent">
          PLAN DE ENTRENAMIENTO
        </h1>
        <h2 className="mt-1 text-center text-2xl font-black italic text-pt-accent">
          SEMANA {weekNumber}
        </h2>
      </div>

      {/* Day Bar */}
      <div className="mx-10 mt-4 flex items-stretch overflow-hidden rounded-md">
        <div className="flex items-center bg-white px-6 py-3">
          <span className="text-lg font-bold text-black whitespace-nowrap">
            {day.dayLabel}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center bg-pt-accent px-6 py-3">
          <span className="text-xl font-extrabold tracking-wide text-black uppercase">
            {day.muscleGroup}
          </span>
        </div>
      </div>

      {/* Exercise Table */}
      <div className="mx-10 mt-6">
        {/* Table Header */}
        <div className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr_0.8fr_0.8fr] bg-pt-accent text-center">
          <div className="border-r border-black/20 px-4 py-3 text-left">
            <span className="text-sm font-extrabold tracking-wide text-black uppercase">
              Ejercicios
            </span>
          </div>
          <div className="border-r border-black/20 px-2 py-3">
            <span className="text-sm font-extrabold tracking-wide text-black uppercase">
              Series
            </span>
          </div>
          <div className="border-r border-black/20 px-2 py-3">
            <span className="text-sm font-extrabold tracking-wide text-black uppercase">
              Reps
            </span>
          </div>
          <div className="border-r border-black/20 px-2 py-3">
            <span className="text-[11px] font-extrabold leading-tight tracking-wide text-black uppercase">
              Tiempo
              <br />
              Descanso
            </span>
          </div>
          <div className="border-r border-black/20 px-2 py-3">
            <span className="text-sm font-extrabold tracking-wide text-black uppercase">
              RIR
            </span>
          </div>
          <div className="px-2 py-3">
            <span className="text-sm font-extrabold tracking-wide text-black uppercase">
              RPE
            </span>
          </div>
        </div>

        {/* Table Rows */}
        {day.exercises.map((exercise, index) => (
          <div
            key={exercise.id}
            className={`grid grid-cols-[2.5fr_1fr_1fr_1.5fr_0.8fr_0.8fr] border-b border-pt-border text-center ${
              index % 2 === 0 ? "bg-pt-dark" : "bg-pt-card/30"
            }`}
          >
            <div className="flex items-center border-r border-pt-border px-4 py-4 text-left">
              <span className="text-base text-white">{exercise.name}</span>
            </div>
            <div className="flex items-center justify-center border-r border-pt-border px-2 py-4">
              <span className="text-base text-white">{exercise.series}</span>
            </div>
            <div className="flex items-center justify-center border-r border-pt-border px-2 py-4">
              <span className="text-base text-white">{exercise.reps}</span>
            </div>
            <div className="flex items-center justify-center border-r border-pt-border px-2 py-4">
              <span className="text-base text-white">{exercise.restTime}</span>
            </div>
            <div className="flex items-center justify-center border-r border-pt-border px-2 py-4">
              <span className="text-base text-white">{exercise.rir}</span>
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <span className="text-base text-white">{exercise.rpe}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Cardio Section */}
      <div className="mx-10 mt-12 mb-4 flex flex-col items-center">
        {/* Glowing CARDIO title */}
        <h3
          className="mb-6 text-4xl font-black tracking-widest text-white uppercase"
          style={{
            textShadow:
              "0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(255,255,255,0.2)",
          }}
        >
          CARDIO
        </h3>

        {/* Cardio Description Box */}
        <div className="w-full rounded-sm border-2 border-dashed border-white/60 px-6 py-5">
          <p className="text-lg text-white italic">{day.cardio.description}</p>
        </div>
      </div>

      {/* Note */}
      <div className="mx-10 mt-6 mb-10">
        <p className="text-sm leading-relaxed text-pt-muted">
          <span className="font-bold text-white">NOTA:</span>{" "}
          {day.cardio.note}
        </p>
      </div>
    </div>
  );
}
