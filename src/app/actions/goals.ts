"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { GoalImportance, GoalTimeframe } from "@/types/goals";

export async function createGoal(formData: {
  title: string;
  description?: string;
  importance: GoalImportance;
  timeframe: GoalTimeframe;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    title: formData.title,
    description: formData.description || null,
    importance: formData.importance,
    timeframe: formData.timeframe,
  });

  if (error) throw error;
  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateGoal(id: string, updates: Partial<{
  title: string;
  description: string;
  importance: GoalImportance;
  timeframe: GoalTimeframe;
  is_completed: boolean;
  is_archived: boolean;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const payload: any = { ...updates, updated_at: new Date().toISOString() };
  if (updates.is_completed === true) {
    payload.completed_at = new Date().toISOString();
  } else if (updates.is_completed === false) {
    payload.completed_at = null;
  }

  const { error } = await supabase
    .from("goals")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteGoal(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard");
  return { success: true };
}
