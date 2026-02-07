"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { PlanListItem } from "@/lib/plan-repository";
import { fetchPlanById } from "@/lib/plan-repository";
import type { WorkoutPlan } from "@/types/workout";

interface PlanListItemProps {
  plan: PlanListItem;
  onLoad: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}

function PlanDetailView({ planData }: { planData: WorkoutPlan }) {
  return (
    <div className="mt-3 space-y-3 border-t border-pt-border pt-3">
      {planData.weeks.map((week) => (
        <div key={week.id}>
          <h4 className="mb-1.5 text-xs font-bold text-pt-accent uppercase tracking-wide">
            Semana {week.weekNumber}
          </h4>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {week.days.map((day) => (
              <div
                key={day.id}
                className="rounded-md border border-pt-border/50 bg-pt-dark p-3"
              >
                <p className="text-xs font-semibold text-white">
                  {day.dayLabel}
                  {day.muscleGroup && (
                    <span className="ml-1 font-normal text-pt-accent">
                      - {day.muscleGroup}
                    </span>
                  )}
                </p>
                {day.exercises.length > 0 ? (
                  <ul className="mt-1.5 space-y-0.5">
                    {day.exercises.map((ex) => (
                      <li key={ex.id} className="text-xs text-pt-muted">
                        {ex.name || "Sin nombre"}{" "}
                        <span className="text-pt-muted/60">
                          {ex.series}x{ex.reps} | {ex.restTime} | RIR {ex.rir}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-pt-muted/50 italic">
                    Sin ejercicios
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PlanListItemRow({ plan, onLoad, onDelete }: PlanListItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [planData, setPlanData] = useState<WorkoutPlan | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete(plan.id);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  async function handleToggleView() {
    if (expanded) {
      setExpanded(false);
      return;
    }

    if (!planData) {
      setLoadingDetail(true);
      const data = await fetchPlanById(plan.id);
      setPlanData(data);
      setLoadingDetail(false);
    }
    setExpanded(true);
  }

  const date = new Date(plan.updatedAt).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-lg border border-pt-border bg-pt-card/50 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{plan.title}</p>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-pt-muted">
            <span>{plan.clientName ?? "Sin cliente"}</span>
            <span>
              {plan.weeksCount} sem / {plan.daysPerWeek} dias
            </span>
            <span>{date}</span>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {confirmDelete ? (
            <>
              <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                Confirmar
              </Button>
              <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                No
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={handleToggleView} disabled={loadingDetail}>
                {loadingDetail ? "Cargando..." : expanded ? "Ocultar" : "Ver"}
              </Button>
              <Button variant="ghost" onClick={() => onLoad(plan.id)}>
                Editar
              </Button>
              <Button variant="ghost" onClick={() => setConfirmDelete(true)}>
                Eliminar
              </Button>
            </>
          )}
        </div>
      </div>

      {expanded && planData && <PlanDetailView planData={planData} />}
    </div>
  );
}
