"use client";

import { useState, useEffect } from "react";
import { countClients } from "@/lib/client-repository";
import { countPlans } from "@/lib/plan-repository";
import { fetchMuscleGroupsWithExercises } from "@/lib/exercise-repository";
import { supabase } from "@/lib/supabase";

interface StatCardProps {
  label: string;
  value: string;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-pt-border bg-pt-card/50 p-4 sm:p-6">
      <p className="text-xs font-semibold text-pt-muted uppercase tracking-wider">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">{value}</p>
    </div>
  );
}

export function OverviewStats() {
  const [clientCount, setClientCount] = useState<number | null>(null);
  const [planCount, setPlanCount] = useState<number | null>(null);
  const [exerciseCount, setExerciseCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    Promise.all([
      countClients(),
      countPlans(),
      fetchMuscleGroupsWithExercises().then((groups) =>
        groups.reduce((sum, g) => sum + g.exercises.length, 0)
      ),
    ])
      .then(([clients, plans, exercises]) => {
        setClientCount(clients);
        setPlanCount(plans);
        setExerciseCount(exercises);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!supabase) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Clientes" value="--" />
        <StatCard label="Planes" value="--" />
        <StatCard label="Ejercicios" value="--" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg border border-pt-border bg-pt-card/30"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Clientes" value={String(clientCount ?? 0)} />
      <StatCard label="Planes" value={String(planCount ?? 0)} />
      <StatCard label="Ejercicios" value={String(exerciseCount ?? 0)} />
    </div>
  );
}
