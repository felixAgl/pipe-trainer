"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { PlanListItem } from "@/lib/plan-repository";

interface PlanListItemProps {
  plan: PlanListItem;
  onLoad: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}

export function PlanListItemRow({ plan, onLoad, onDelete }: PlanListItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete(plan.id);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  const date = new Date(plan.updatedAt).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-pt-border bg-pt-card/50 p-4 sm:flex-row sm:items-center sm:justify-between">
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
            <Button variant="ghost" onClick={() => onLoad(plan.id)}>
              Cargar
            </Button>
            <Button variant="ghost" onClick={() => setConfirmDelete(true)}>
              Eliminar
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
