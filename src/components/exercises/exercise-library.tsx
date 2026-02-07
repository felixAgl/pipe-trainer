"use client";

import { useState, useEffect } from "react";
import {
  fetchMuscleGroupsWithExercises,
  createMuscleGroup,
  updateMuscleGroup,
  deleteMuscleGroup,
  createExercise,
  updateExercise,
  deleteExercise,
} from "@/lib/exercise-repository";
import type { MuscleGroupWithExercises } from "@/lib/exercise-repository";
import { supabase } from "@/lib/supabase";
import { MuscleGroupSection } from "./muscle-group-section";
import { AddMuscleGroupForm } from "./add-muscle-group-form";
import { Button } from "@/components/ui/button";

export function ExerciseLibrary() {
  const [groups, setGroups] = useState<MuscleGroupWithExercises[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddGroup, setShowAddGroup] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMuscleGroupsWithExercises();
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando ejercicios");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddGroup(name: string) {
    try {
      await createMuscleGroup(name);
      await loadData();
      setShowAddGroup(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando grupo");
    }
  }

  async function handleEditGroup(id: string, name: string) {
    try {
      await updateMuscleGroup(id, name);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error actualizando grupo");
    }
  }

  async function handleDeleteGroup(id: string) {
    try {
      await deleteMuscleGroup(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error eliminando grupo");
    }
  }

  async function handleAddExercise(groupId: string, name: string) {
    try {
      await createExercise(name, groupId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando ejercicio");
    }
  }

  async function handleEditExercise(id: string, name: string) {
    try {
      await updateExercise(id, name);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error actualizando ejercicio");
    }
  }

  async function handleDeleteExercise(id: string) {
    try {
      await deleteExercise(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error eliminando ejercicio");
    }
  }

  if (!supabase) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-pt-border bg-pt-card/30 px-6 py-16 text-center">
        <h3 className="text-lg font-semibold text-white">Supabase no configurado</h3>
        <p className="mt-2 max-w-sm text-sm text-pt-muted">
          Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-pt-card/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-600/50 bg-red-600/10 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            className="mt-1 text-xs text-red-400/70 hover:text-red-400"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="flex justify-end">
        {!showAddGroup && (
          <Button onClick={() => setShowAddGroup(true)}>
            + Grupo muscular
          </Button>
        )}
      </div>

      {showAddGroup && (
        <AddMuscleGroupForm
          onSubmit={handleAddGroup}
          onCancel={() => setShowAddGroup(false)}
        />
      )}

      {groups.length === 0 && !showAddGroup && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-pt-border bg-pt-card/30 px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-white">Sin grupos musculares</h3>
          <p className="mt-2 max-w-sm text-sm text-pt-muted">
            Crea tu primer grupo muscular para empezar a agregar ejercicios.
          </p>
          <Button onClick={() => setShowAddGroup(true)} className="mt-6">
            + Grupo muscular
          </Button>
        </div>
      )}

      {groups.map((group) => (
        <MuscleGroupSection
          key={group.id}
          group={group}
          onEditGroup={handleEditGroup}
          onDeleteGroup={handleDeleteGroup}
          onAddExercise={handleAddExercise}
          onEditExercise={handleEditExercise}
          onDeleteExercise={handleDeleteExercise}
        />
      ))}
    </div>
  );
}
