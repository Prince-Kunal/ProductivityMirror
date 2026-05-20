"use server";

import { createClient } from "@/utils/supabase/server";

export async function toggleTaskCompletion(taskId: string, isCompleted: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from('tasks')
    .update({ 
      is_completed: isCompleted,
    })
    .eq('id', taskId)
    .eq('user_id', user.id);

  if (error) {
    throw error;
  }

  return { success: true };
}
