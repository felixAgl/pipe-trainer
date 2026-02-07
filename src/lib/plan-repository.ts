import { supabase } from "@/lib/supabase";
import type { WorkoutPlan } from "@/types/workout";
import type { Json } from "@/types/database";

interface PlanRow {
  id: string;
  title: string;
  client_id: string | null;
  plan_data: Json;
  weeks_count: number;
  days_per_week: number;
  created_at: string;
  updated_at: string;
  clients: { name: string } | null;
}

interface PlanListItem {
  id: string;
  title: string;
  clientName: string | null;
  weeksCount: number;
  daysPerWeek: number;
  createdAt: string;
  updatedAt: string;
}

async function fetchPlans(): Promise<PlanListItem[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("workout_plans")
    .select("*, clients(name)")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data as unknown as PlanRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    clientName: row.clients?.name ?? null,
    weeksCount: row.weeks_count,
    daysPerWeek: row.days_per_week,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

async function fetchPlanById(id: string): Promise<WorkoutPlan | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("workout_plans")
    .select("plan_data")
    .eq("id", id)
    .single();

  if (error) return null;
  return data.plan_data as unknown as WorkoutPlan;
}

interface SavePlanParams {
  title: string;
  plan: WorkoutPlan;
  clientId?: string | null;
}

async function savePlan({ title, plan, clientId }: SavePlanParams): Promise<string> {
  if (!supabase) throw new Error("Supabase not configured");

  const weeksCount = plan.weeks.length;
  const daysPerWeek = plan.weeks[0]?.days.length ?? 0;

  const { data, error } = await supabase
    .from("workout_plans")
    .insert({
      title,
      client_id: clientId ?? null,
      plan_data: plan as unknown as Json,
      weeks_count: weeksCount,
      days_per_week: daysPerWeek,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}

async function updatePlan(
  id: string,
  { title, plan, clientId }: SavePlanParams
): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");

  const weeksCount = plan.weeks.length;
  const daysPerWeek = plan.weeks[0]?.days.length ?? 0;

  const { error } = await supabase
    .from("workout_plans")
    .update({
      title,
      client_id: clientId ?? null,
      plan_data: plan as unknown as Json,
      weeks_count: weeksCount,
      days_per_week: daysPerWeek,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

async function deletePlan(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("workout_plans").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

async function countPlans(): Promise<number> {
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("workout_plans")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count ?? 0;
}

export { fetchPlans, fetchPlanById, savePlan, updatePlan, deletePlan, countPlans };
export type { PlanListItem, SavePlanParams };
