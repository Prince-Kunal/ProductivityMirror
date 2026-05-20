"use server";

import { createClient } from "@/utils/supabase/server";

export async function toggleTaskCompletion(taskId: string, isCompleted: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify the task belongs to this user and is within the editable window (today or yesterday)
  const { data: existingTask } = await supabase
    .from('tasks')
    .select('start_time')
    .eq('id', taskId)
    .eq('user_id', user.id)
    .single();

  if (!existingTask) throw new Error("Task not found.");

  const startOfYesterday = new Date();
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  startOfYesterday.setHours(0, 0, 0, 0);

  if (new Date(existingTask.start_time) < startOfYesterday) {
    throw new Error("This task is locked. You can only edit tasks from today or yesterday.");
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
