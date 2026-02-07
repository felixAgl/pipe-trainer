"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchPlans, deletePlan } from "@/lib/plan-repository";
import type { PlanListItem } from "@/lib/plan-repository";
import { PlanListItemRow } from "@/components/plans/plan-list-item";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export function PlanList() {
  const [plans, setPlans] = useState<PlanListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlans();
      setPlans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando planes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleLoad(id: string) {
    router.push(`/dashboard/generator?planId=${id}`);
  }

  async function handleDelete(id: string) {
    await deletePlan(id);
    await loadData();
  }

  if (!supabase) {
    return (
      <div className="rounded-lg border border-pt-border bg-pt-card/50 p-6 text-center">
        <p className="text-sm text-pt-muted">
          Supabase no esta configurado. Configura las variables de entorno para gestionar planes.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-lg border border-pt-border bg-pt-card/30"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-4">
        <p className="text-sm text-red-400">{error}</p>
        <Button variant="secondary" onClick={loadData} className="mt-2">
          Reintentar
        </Button>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-pt-border p-8 text-center">
        <p className="text-sm text-pt-muted">
          No hay planes guardados todavia.
        </p>
        <Link href="/dashboard/generator">
          <Button className="mt-3">Ir al Generador</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {plans.map((plan) => (
        <PlanListItemRow
          key={plan.id}
          plan={plan}
          onLoad={handleLoad}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
