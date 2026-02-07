"use client";

import { useState, useEffect, useRef } from "react";
import type { WorkoutDay, WorkoutPlan, WorkoutWeek } from "@/types/workout";
import { DayEditor } from "@/components/workout/day-editor";
import { WorkoutDayCard } from "@/components/workout/workout-day-card";
import { Button } from "@/components/ui/button";
import { createWorkoutDay, createWorkoutPlan } from "@/lib/plan-factory";
import { captureNode } from "@/lib/image-capture";
import { cn } from "@/lib/utils";

const STORAGE_KEYS = {
  PLAN: "pipe-trainer-plan",
} as const;

interface GeneratedImage {
  dayNumber: number;
  weekNumber: number;
  dayLabel: string;
  muscleGroup: string;
  dataUrl: string;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

export function PlanBuilder() {
  const [plan, setPlan] = useState<WorkoutPlan>(() => createWorkoutPlan(2, 5));
  const [activeWeek, setActiveWeek] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const [previewDay, setPreviewDay] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const captureContainerRef = useRef<HTMLDivElement>(null);

  const currentWeek = plan.weeks[activeWeek];
  const currentDay = currentWeek?.days[activeDay];

  // Auto-load plan from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLAN);
      if (saved) {
        setPlan(JSON.parse(saved) as WorkoutPlan);
      }
    } catch {
      // Corrupted data, ignore and use default plan
    }
  }, []);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // -- Week Management --
  function handleAddWeek() {
    const newWeek: WorkoutWeek = {
      id: crypto.randomUUID(),
      weekNumber: plan.weeks.length + 1,
      days: Array.from({ length: 5 }, (_, i) => createWorkoutDay(i + 1)),
    };
    setPlan({ ...plan, weeks: [...plan.weeks, newWeek] });
  }

  function handleRemoveWeek(weekIndex: number) {
    if (plan.weeks.length <= 1) return;
    const weeks = plan.weeks.filter((_, i) => i !== weekIndex);
    const renumbered = weeks.map((w, i) => ({ ...w, weekNumber: i + 1 }));
    setPlan({ ...plan, weeks: renumbered });
    if (activeWeek >= renumbered.length) {
      setActiveWeek(renumbered.length - 1);
    }
  }

  function handleDuplicateWeek(weekIndex: number) {
    const source = plan.weeks[weekIndex];
    const newWeek: WorkoutWeek = {
      ...structuredClone(source),
      id: crypto.randomUUID(),
      weekNumber: plan.weeks.length + 1,
      days: source.days.map((d) => ({
        ...structuredClone(d),
        id: crypto.randomUUID(),
        exercises: d.exercises.map((e) => ({
          ...structuredClone(e),
          id: crypto.randomUUID(),
        })),
      })),
    };
    setPlan({ ...plan, weeks: [...plan.weeks, newWeek] });
  }

  // -- Day Management --
  function handleDayChange(dayIndex: number, updated: WorkoutDay) {
    const weeks = [...plan.weeks];
    const days = [...weeks[activeWeek].days];
    days[dayIndex] = updated;
    weeks[activeWeek] = { ...weeks[activeWeek], days };
    setPlan({ ...plan, weeks });
  }

  function handleAddDay() {
    if (currentWeek.days.length >= 7) return;
    const weeks = [...plan.weeks];
    const newDay = createWorkoutDay(currentWeek.days.length + 1);
    weeks[activeWeek] = {
      ...weeks[activeWeek],
      days: [...weeks[activeWeek].days, newDay],
    };
    setPlan({ ...plan, weeks });
  }

  function handleRemoveDay(dayIndex: number) {
    if (currentWeek.days.length <= 1) return;
    const weeks = [...plan.weeks];
    const days = weeks[activeWeek].days.filter((_, i) => i !== dayIndex);
    const renumbered = days.map((d, i) => ({
      ...d,
      dayNumber: i + 1,
      dayLabel: `Dia ${i + 1}`,
    }));
    weeks[activeWeek] = { ...weeks[activeWeek], days: renumbered };
    setPlan({ ...plan, weeks });
    if (activeDay >= renumbered.length) {
      setActiveDay(renumbered.length - 1);
    }
  }

  // -- Client-side Image Capture --
  async function captureDayImage(
    day: WorkoutDay,
    weekNumber: number
  ): Promise<GeneratedImage | null> {
    const container = captureContainerRef.current;
    if (!container) throw new Error("Capture container not found");

    // Render the card into the offscreen container
    const { createRoot } = await import("react-dom/client");

    return new Promise((resolve, reject) => {
      const root = createRoot(container);

      root.render(
        <WorkoutDayCard day={day} weekNumber={weekNumber} />
      );

      // Wait for render + fonts to settle
      requestAnimationFrame(() => {
        setTimeout(async () => {
          try {
            const cardNode = container.firstElementChild as HTMLElement;
            if (!cardNode) {
              root.unmount();
              reject(new Error("Card not rendered"));
              return;
            }

            const result = await captureNode(cardNode);

            root.unmount();

            if (!result.success) {
              reject(new Error(result.error));
              return;
            }

            resolve({
              dayNumber: day.dayNumber,
              weekNumber,
              dayLabel: `S${weekNumber} - ${day.dayLabel}`,
              muscleGroup: day.muscleGroup,
              dataUrl: result.data.dataUrl,
            });
          } catch (err) {
            root.unmount();
            reject(err);
          }
        }, 200);
      });
    });
  }

  async function handleGenerateAll() {
    setGenerating(true);
    setError(null);
    const allImages: GeneratedImage[] = [];

    for (const week of plan.weeks) {
      for (const day of week.days) {
        try {
          const img = await captureDayImage(day, week.weekNumber);
          if (img) allImages.push(img);
        } catch (err) {
          setError(
            `Error generando S${week.weekNumber} ${day.dayLabel}: ${err instanceof Error ? err.message : "Error desconocido"}`
          );
          setGenerating(false);
          return;
        }
      }
    }

    setGeneratedImages(allImages);
    setGenerating(false);
    setToast({ message: `${allImages.length} imagenes generadas`, type: "success" });
  }

  async function handleGenerateDay(dayIndex: number) {
    setGenerating(true);
    setError(null);

    const day = currentWeek.days[dayIndex];

    try {
      const img = await captureDayImage(day, currentWeek.weekNumber);
      if (img) {
        setGeneratedImages((prev) => [
          ...prev.filter(
            (existing) =>
              !(
                existing.dayNumber === day.dayNumber &&
                existing.weekNumber === currentWeek.weekNumber
              )
          ),
          img,
        ]);
        setToast({ message: `${day.dayLabel} generada`, type: "success" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generando imagen");
    }

    setGenerating(false);
  }

  // -- PDF Generation --
  async function handleDownloadPDF() {
    if (generatedImages.length === 0) {
      setError("Genera las imagenes primero antes de descargar el PDF");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [1080, 1920],
      });

      for (let i = 0; i < generatedImages.length; i++) {
        const img = generatedImages[i];

        if (i > 0) {
          doc.addPage([1080, 1920]);
        }

        doc.addImage(img.dataUrl, "JPEG", 0, 0, 1080, 1920, undefined, "MEDIUM");
      }

      doc.save("plan-de-entrenamiento.pdf");
      setToast({ message: "PDF descargado", type: "success" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generando PDF");
    }

    setGenerating(false);
  }

  // -- Save/Load localStorage --
  function handleSavePlan() {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan));
      setError(null);
      setToast({ message: "Plan guardado", type: "success" });
    } catch {
      setToast({ message: "Error al guardar el plan", type: "error" });
    }
  }

  function handleLoadPlan() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLAN);
      if (saved) {
        setPlan(JSON.parse(saved) as WorkoutPlan);
        setActiveWeek(0);
        setActiveDay(0);
        setToast({ message: "Plan cargado", type: "success" });
      } else {
        setToast({ message: "No hay plan guardado", type: "error" });
      }
    } catch {
      setToast({ message: "Error al cargar: datos corruptos", type: "error" });
    }
  }

  return (
    <>
      {/* Offscreen capture container - hidden from view, full size for capture */}
      <div
        ref={captureContainerRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: 1080,
          height: 1920,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      />

      {/* Toast notification */}
      {toast && (
        <div
          className={cn(
            "fixed top-4 right-4 z-50 rounded-md px-4 py-2 text-sm font-medium shadow-lg transition-opacity",
            toast.type === "success"
              ? "bg-pt-accent text-black"
              : "bg-red-900/90 text-red-200"
          )}
        >
          {toast.message}
        </div>
      )}

      <div className="grid min-h-screen grid-cols-1 gap-4 p-3 sm:gap-6 sm:p-6 xl:grid-cols-[1fr_500px]">
        {/* Left Panel - Editor */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Top Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              <span className="font-black italic text-pt-accent">PT</span>{" "}
              Plan Builder
            </h1>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <Button variant="ghost" onClick={handleSavePlan}>
                Guardar
              </Button>
              <Button variant="ghost" onClick={handleLoadPlan}>
                Cargar
              </Button>
              <Button onClick={handleGenerateAll} disabled={generating}>
                {generating ? "Generando..." : "Generar Todo"}
              </Button>
              <Button
                variant="secondary"
                onClick={handleDownloadPDF}
                disabled={generating || generatedImages.length === 0}
              >
                Descargar PDF
              </Button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-900/50 px-4 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Week Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {plan.weeks.map((week, i) => (
              <button
                key={week.id}
                onClick={() => {
                  setActiveWeek(i);
                  setActiveDay(0);
                }}
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-semibold transition-colors",
                  activeWeek === i
                    ? "bg-pt-accent text-black"
                    : "bg-pt-card text-pt-muted hover:text-white"
                )}
              >
                Semana {week.weekNumber}
              </button>
            ))}
            <Button variant="ghost" onClick={handleAddWeek} className="text-xs">
              + Semana
            </Button>
            {plan.weeks.length > 1 && (
              <Button
                variant="ghost"
                onClick={() => handleRemoveWeek(activeWeek)}
                className="text-xs text-red-400"
              >
                - Semana
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => handleDuplicateWeek(activeWeek)}
              className="text-xs"
            >
              Duplicar Semana
            </Button>
          </div>

          {/* Day Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {currentWeek?.days.map((day, i) => (
              <button
                key={day.id}
                onClick={() => setActiveDay(i)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                  activeDay === i
                    ? "bg-pt-accent text-black"
                    : "bg-pt-card text-pt-muted hover:text-white"
                )}
              >
                {day.dayLabel}
                {day.muscleGroup && ` - ${day.muscleGroup}`}
              </button>
            ))}
            {currentWeek && currentWeek.days.length < 7 && (
              <Button variant="ghost" onClick={handleAddDay} className="text-xs">
                + Dia
              </Button>
            )}
          </div>

          {/* Day Editor */}
          {currentDay && (
            <DayEditor
              key={currentDay.id}
              day={currentDay}
              onChange={(updated) => handleDayChange(activeDay, updated)}
              onRemove={() => handleRemoveDay(activeDay)}
              canRemove={currentWeek.days.length > 1}
            />
          )}

          {/* Generate single day button */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => handleGenerateDay(activeDay)}
              disabled={generating}
            >
              {generating
                ? "Generando..."
                : `Generar ${currentDay?.dayLabel ?? "Dia"}`}
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                setPreviewDay(previewDay === activeDay ? null : activeDay)
              }
            >
              {previewDay === activeDay ? "Ocultar Preview" : "Ver Preview"}
            </Button>
          </div>

          {/* Generated Images Gallery */}
          {generatedImages.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-3 text-lg font-bold text-white">
                Imagenes Generadas ({generatedImages.length})
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {generatedImages.map((img) => (
                  <div
                    key={`${img.weekNumber}-${img.dayNumber}`}
                    className="flex flex-col gap-2"
                  >
                    <a
                      href={img.dataUrl}
                      download={`S${img.weekNumber}-${img.dayLabel}.png`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.dataUrl}
                        alt={`${img.dayLabel} - ${img.muscleGroup}`}
                        className="rounded-md border border-pt-border"
                      />
                    </a>
                    <span className="text-xs text-pt-muted">
                      {img.dayLabel} - {img.muscleGroup}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Live Preview */}
        <div className="hidden xl:block">
          <div className="sticky top-6">
            <h3 className="mb-3 text-sm font-bold text-pt-muted uppercase tracking-wide">
              Preview en vivo
            </h3>
            <div
              className="overflow-hidden rounded-lg border border-pt-border"
              style={{ width: 486, height: 864 }}
            >
              <div
                className="origin-top-left"
                style={{ transform: "scale(0.45)", width: 1080 }}
              >
                {currentDay && currentWeek && (
                  <WorkoutDayCard
                    day={currentDay}
                    weekNumber={currentWeek.weekNumber}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Preview (full width) */}
        {previewDay !== null && currentDay && (
          <div className="xl:hidden">
            <div
              className="overflow-hidden rounded-lg border border-pt-border"
              style={{ maxWidth: "100%", aspectRatio: "1080/1920" }}
            >
              <div
                className="origin-top-left"
                style={{ transform: "scale(0.33)", width: 1080, transformOrigin: "top left" }}
              >
                <WorkoutDayCard
                  day={currentDay}
                  weekNumber={currentWeek.weekNumber}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
