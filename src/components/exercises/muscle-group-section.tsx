"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExerciseListItem } from "./exercise-list-item";
import { AddExerciseForm } from "./add-exercise-form";
import type { MuscleGroupWithExercises } from "@/lib/exercise-repository";

interface MuscleGroupSectionProps {
  group: MuscleGroupWithExercises;
  onEditGroup: (id: string, name: string) => Promise<void>;
  onDeleteGroup: (id: string) => Promise<void>;
  onAddExercise: (groupId: string, name: string) => Promise<void>;
  onEditExercise: (exerciseId: string, name: string) => Promise<void>;
  onDeleteExercise: (exerciseId: string) => Promise<void>;
}

export function MuscleGroupSection({
  group,
  onEditGroup,
  onDeleteGroup,
  onAddExercise,
  onEditExercise,
  onDeleteExercise,
}: MuscleGroupSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(group.name);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSaveName() {
    if (!name.trim() || name.trim() === group.name) {
      setEditingName(false);
      setName(group.name);
      return;
    }

    setSaving(true);
    try {
      await onEditGroup(group.id, name.trim());
      setEditingName(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteGroup() {
    setSaving(true);
    try {
      await onDeleteGroup(group.id);
    } finally {
      setSaving(false);
      setConfirmDelete(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSaveName();
    if (e.key === "Escape") {
      setEditingName(false);
      setName(group.name);
    }
  }

  return (
    <div className="rounded-lg border border-pt-border bg-pt-card/50">
      <div className="flex items-center justify-between gap-2 border-b border-pt-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-pt-muted transition-transform hover:text-white"
            aria-label={expanded ? "Colapsar" : "Expandir"}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className={`transition-transform ${expanded ? "rotate-90" : ""}`}
            >
              <path d="M6 4l4 4-4 4" />
            </svg>
          </button>

          {editingName ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={handleKeyDown}
              autoFocus
              className="rounded-md border border-pt-border bg-pt-card px-2 py-1 text-sm font-semibold text-white uppercase tracking-wider focus:border-pt-accent focus:outline-none"
            />
          ) : (
            <h2
              className="cursor-pointer text-sm font-semibold text-white uppercase tracking-wider hover:text-pt-accent"
              onClick={() => setEditingName(true)}
            >
              {group.name}
            </h2>
          )}

          <span className="rounded-full bg-pt-border px-2 py-0.5 text-xs text-pt-muted">
            {group.exercises.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {!confirmDelete ? (
            <Button
              variant="ghost"
              onClick={() => setConfirmDelete(true)}
              className="px-2 py-1 text-xs text-red-400 hover:text-red-300"
            >
              Eliminar grupo
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-pt-muted">
                Eliminar {group.exercises.length} ejercicios?
              </span>
              <Button variant="danger" onClick={handleDeleteGroup} disabled={saving} className="px-2 py-1 text-xs">
                {saving ? "..." : "Si"}
              </Button>
              <Button variant="ghost" onClick={() => setConfirmDelete(false)} disabled={saving} className="px-2 py-1 text-xs">
                No
              </Button>
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="divide-y divide-pt-border">
          {group.exercises.length === 0 && !showAddExercise && (
            <div className="px-4 py-4 text-center text-sm text-pt-muted sm:px-6">
              Sin ejercicios. Agrega el primero.
            </div>
          )}

          {group.exercises.map((exercise) => (
            <ExerciseListItem
              key={exercise.id}
              exercise={exercise}
              onEdit={onEditExercise}
              onDelete={onDeleteExercise}
            />
          ))}

          {showAddExercise ? (
            <AddExerciseForm
              onSubmit={async (exerciseName) => {
                await onAddExercise(group.id, exerciseName);
                setShowAddExercise(false);
              }}
              onCancel={() => setShowAddExercise(false)}
            />
          ) : (
            <div className="px-4 py-2 sm:px-6">
              <Button
                variant="ghost"
                onClick={() => setShowAddExercise(true)}
                className="text-xs"
              >
                + Agregar ejercicio
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
