"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ExerciseRow } from "@/lib/exercise-repository";

interface ExerciseListItemProps {
  exercise: ExerciseRow;
  onEdit: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ExerciseListItem({ exercise, onEdit, onDelete }: ExerciseListItemProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(exercise.name);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSave() {
    if (!name.trim() || name.trim() === exercise.name) {
      setEditing(false);
      setName(exercise.name);
      return;
    }

    setSaving(true);
    try {
      await onEdit(exercise.id, name.trim());
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await onDelete(exercise.id);
    } finally {
      setSaving(false);
      setConfirmDelete(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditing(false);
      setName(exercise.name);
    }
  }

  if (confirmDelete) {
    return (
      <div className="flex items-center justify-between gap-2 px-4 py-2 sm:px-6">
        <span className="text-sm text-pt-muted">Eliminar &quot;{exercise.name}&quot;?</span>
        <div className="flex gap-2">
          <Button variant="danger" onClick={handleDelete} disabled={saving}>
            {saving ? "..." : "Eliminar"}
          </Button>
          <Button variant="ghost" onClick={() => setConfirmDelete(false)} disabled={saving}>
            No
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center justify-between gap-2 px-4 py-2 sm:px-6">
      {editing ? (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 rounded-md border border-pt-border bg-pt-card px-2 py-1 text-sm text-white focus:border-pt-accent focus:outline-none"
        />
      ) : (
        <span
          className="flex-1 cursor-pointer text-sm text-white hover:text-pt-accent"
          onClick={() => setEditing(true)}
        >
          {exercise.name}
        </span>
      )}
      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {!editing && (
          <>
            <Button variant="ghost" onClick={() => setEditing(true)} className="px-2 py-1 text-xs">
              Editar
            </Button>
            <Button variant="ghost" onClick={() => setConfirmDelete(true)} className="px-2 py-1 text-xs text-red-400 hover:text-red-300">
              Eliminar
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
