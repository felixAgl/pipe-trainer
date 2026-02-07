import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database";

type MuscleGroupRow = Tables<"muscle_groups">;
type ExerciseRow = Tables<"exercises">;

interface MuscleGroupWithExercises extends MuscleGroupRow {
  exercises: ExerciseRow[];
}

async function fetchMuscleGroupsWithExercises(): Promise<MuscleGroupWithExercises[]> {
  if (!supabase) return [];

  const { data: groups, error: groupsError } = await supabase
    .from("muscle_groups")
    .select("*")
    .order("display_order", { ascending: true });

  if (groupsError) throw new Error(groupsError.message);

  const { data: exercises, error: exercisesError } = await supabase
    .from("exercises")
    .select("*")
    .order("name", { ascending: true });

  if (exercisesError) throw new Error(exercisesError.message);

  return (groups ?? []).map((group) => ({
    ...group,
    exercises: (exercises ?? []).filter((e) => e.muscle_group_id === group.id),
  }));
}

async function createMuscleGroup(name: string): Promise<MuscleGroupRow> {
  if (!supabase) throw new Error("Supabase not configured");

  const { data: maxOrder } = await supabase
    .from("muscle_groups")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (maxOrder?.display_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("muscle_groups")
    .insert({ name: name.trim(), display_order: nextOrder })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function updateMuscleGroup(id: string, name: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("muscle_groups")
    .update({ name: name.trim() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

async function deleteMuscleGroup(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("muscle_groups")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

async function createExercise(name: string, muscleGroupId: string): Promise<ExerciseRow> {
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("exercises")
    .insert({ name: name.trim(), muscle_group_id: muscleGroupId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function updateExercise(id: string, name: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("exercises")
    .update({ name: name.trim() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

async function deleteExercise(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("exercises")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

async function fetchExercisesByMuscleGroup(): Promise<Record<string, string[]>> {
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("muscle_groups")
    .select("name, exercises(name)")
    .order("name");

  if (error) return {};

  const result: Record<string, string[]> = {};
  for (const group of data ?? []) {
    const exercises = group.exercises as unknown as { name: string }[];
    result[group.name.toUpperCase()] = exercises.map((e) => e.name);
  }
  return result;
}

export {
  fetchMuscleGroupsWithExercises,
  createMuscleGroup,
  updateMuscleGroup,
  deleteMuscleGroup,
  createExercise,
  updateExercise,
  deleteExercise,
  fetchExercisesByMuscleGroup,
};

export type { MuscleGroupRow, ExerciseRow, MuscleGroupWithExercises };
