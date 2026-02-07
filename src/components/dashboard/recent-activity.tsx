"use client";

import { useState, useEffect } from "react";
import { fetchClients } from "@/lib/client-repository";
import { fetchPlans } from "@/lib/plan-repository";
import type { ClientRow } from "@/lib/client-repository";
import type { PlanListItem } from "@/lib/plan-repository";
import { supabase } from "@/lib/supabase";

export function RecentActivity() {
  const [recentClients, setRecentClients] = useState<ClientRow[]>([]);
  const [recentPlans, setRecentPlans] = useState<PlanListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    Promise.all([fetchClients(), fetchPlans()])
      .then(([clients, plans]) => {
        setRecentClients(clients.slice(0, 5));
        setRecentPlans(plans.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!supabase || loading) return null;

  if (recentClients.length === 0 && recentPlans.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {recentClients.length > 0 && (
        <div className="rounded-lg border border-pt-border bg-pt-card/50">
          <div className="border-b border-pt-border px-4 py-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Clientes Recientes
            </h3>
          </div>
          <div className="divide-y divide-pt-border">
            {recentClients.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-white">{c.name}</span>
                <span className="text-xs text-pt-muted">
                  {new Date(c.created_at).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentPlans.length > 0 && (
        <div className="rounded-lg border border-pt-border bg-pt-card/50">
          <div className="border-b border-pt-border px-4 py-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Planes Recientes
            </h3>
          </div>
          <div className="divide-y divide-pt-border">
            {recentPlans.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0 flex-1">
                  <span className="text-sm text-white">{p.title}</span>
                  {p.clientName && (
                    <span className="ml-2 text-xs text-pt-muted">({p.clientName})</span>
                  )}
                </div>
                <span className="text-xs text-pt-muted">
                  {new Date(p.updatedAt).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
