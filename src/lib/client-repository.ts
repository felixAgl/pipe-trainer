import { supabase } from "@/lib/supabase";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database";

type ClientRow = Tables<"clients">;
type ClientInsert = TablesInsert<"clients">;
type ClientUpdate = TablesUpdate<"clients">;

async function fetchClients(): Promise<ClientRow[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

async function createClient(client: ClientInsert): Promise<ClientRow> {
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("clients")
    .insert(client)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function updateClient(id: string, updates: ClientUpdate): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("clients")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

async function deleteClient(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

async function countClients(): Promise<number> {
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count ?? 0;
}

export { fetchClients, createClient, updateClient, deleteClient, countClients };
export type { ClientRow, ClientInsert, ClientUpdate };
