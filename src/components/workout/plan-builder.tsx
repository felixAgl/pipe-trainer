"use client";

import { useState } from "react";
import type { WorkoutDay, WorkoutPlan, WorkoutWeek } from "@/types/workout";
import { DayEditor } from "@/components/workout/day-editor";
import { WorkoutDayCard } from "@/components/workout/workout-day-card";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import { createWorkoutDay, createWorkoutPlan } from "@/lib/plan-factory";
import { cn } from "@/lib/utils";

interface GeneratedImage {
  dayNumber: number;
  dayLabel: string;
  muscleGroup: string;
  url: string;
}

export function PlanBuilder() {
  const [plan, setPlan] = useState<WorkoutPlan>(() => createWorkoutPlan(2, 5));
  const [activeWeek, setActiveWeek] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const [previewDay, setPreviewDay] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const currentWeek = plan.weeks[activeWeek];
  const currentDay = currentWeek?.days[activeDay];

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
    // Renumber
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
    // Renumber
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

  // -- Image Generation --
  async function handleGenerateAll() {
    setGenerating(true);
    setError(null);
    const allImages: GeneratedImage[] = [];

    for (const week of plan.weeks) {
      const response = await fetch("/api/generate-image?batch=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          days: week.days,
          weekNumber: week.weekNumber,
        }),
      });

      if (!response.ok) {
        setError(`Error generating week ${week.weekNumber}`);
        setGenerating(false);
        return;
      }

      const data = await response.json();
      const successImages = data.images
        .filter((img: { success: boolean }) => img.success)
        .map((img: GeneratedImage) => ({
          ...img,
          dayLabel: `S${week.weekNumber} - ${img.dayLabel}`,
        }));
      allImages.push(...successImages);
    }

    setGeneratedImages(allImages);
    setGenerating(false);
  }

  async function handleGenerateDay(dayIndex: number) {
    setGenerating(true);
    setError(null);

    const day = currentWeek.days[dayIndex];
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        day,
        weekNumber: currentWeek.weekNumber,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      setError(errData.error ?? "Error generating image");
      setGenerating(false);
      return;
    }

    const data = await response.json();
    setGeneratedImages((prev) => [
      ...prev.filter((img) => img.dayNumber !== day.dayNumber),
      {
        dayNumber: day.dayNumber,
        dayLabel: `S${currentWeek.weekNumber} - ${day.dayLabel}`,
        muscleGroup: day.muscleGroup,
        url: data.url,
      },
    ]);
    setGenerating(false);
  }

  // -- PDF Generation --
  async function handleDownloadPDF() {
    if (generatedImages.length === 0) {
      setError("Generate images first before downloading PDF");
      return;
    }

    setGenerating(true);
    setError(null);

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "px", format: [1080, 1920] });

    for (let i = 0; i < generatedImages.length; i++) {
      const img = generatedImages[i];

      // Fetch the image as blob
      const response = await fetch(img.url);
      const blob = await response.blob();
      const dataUrl = await blobToDataURL(blob);

      if (i > 0) {
        doc.addPage([1080, 1920]);
      }

      doc.addImage(dataUrl, "PNG", 0, 0, 1080, 1920);
    }

    doc.save("plan-de-entrenamiento.pdf");
    setGenerating(false);
  }

  // -- Save/Load localStorage --
  function handleSavePlan() {
    localStorage.setItem("pipe-trainer-plan", JSON.stringify(plan));
    setError(null);
  }

  function handleLoadPlan() {
    const saved = localStorage.getItem("pipe-trainer-plan");
    if (saved) {
      setPlan(JSON.parse(saved) as WorkoutPlan);
      setActiveWeek(0);
      setActiveDay(0);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 p-6 xl:grid-cols-[1fr_500px]">
      {/* Left Panel - Editor */}
      <div className="flex flex-col gap-6">
        {/* Top Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">
            <span className="font-black italic text-pt-accent">PT</span>{" "}
            Plan Builder
          </h1>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSavePlan}>
              Guardar
            </Button>
            <Button variant="ghost" onClick={handleLoadPlan}>
              Cargar
            </Button>
            <Button
              onClick={handleGenerateAll}
              disabled={generating}
            >
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
        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
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
            {generating ? "Generando..." : `Generar ${currentDay?.dayLabel ?? "Dia"}`}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setPreviewDay(previewDay === activeDay ? null : activeDay)}
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
                <div key={`${img.dayLabel}-${img.dayNumber}`} className="flex flex-col gap-2">
                  <a href={img.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={img.url}
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
          <div className="origin-top-left scale-[0.45] overflow-hidden rounded-lg border border-pt-border">
            {currentDay && currentWeek && (
              <WorkoutDayCard
                day={currentDay}
                weekNumber={currentWeek.weekNumber}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Preview (full width) */}
      {previewDay !== null && currentDay && (
        <div className="xl:hidden">
          <div className="origin-top-left scale-[0.35] overflow-hidden rounded-lg border border-pt-border sm:scale-[0.5]">
            <WorkoutDayCard
              day={currentDay}
              weekNumber={currentWeek.weekNumber}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
