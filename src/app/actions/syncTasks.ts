"use server";

import { createClient } from "@/utils/supabase/server";
import { fetchCalendarEvents, mapColorIdToDifficulty } from "@/services/calendar";

export async function syncTasksAction(providerToken: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Fetch events for today (or a broader range)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // We can fetch a week's worth of data to be safe, but let's stick to 7 days forward
  const endOfWeek = new Date();
  endOfWeek.setDate(endOfWeek.getDate() + 7);
  endOfWeek.setHours(23, 59, 59, 999);

  try {
    const events = await fetchCalendarEvents(providerToken, startOfDay.toISOString(), endOfWeek.toISOString());
    console.log(`Fetched ${events.length} events from Google Calendar.`);
    
    events.forEach(e => {
      console.log(`Event: "${e.summary}" - colorId: ${e.colorId || 'none'} - mapped to: ${mapColorIdToDifficulty(e.colorId)}`);
    });

    const tasksToUpsert = events
      .filter(event => {
        // Only keep events that have a recognized colorId
        return mapColorIdToDifficulty(event.colorId) !== null;
      })
      .map(event => {
        const difficulty = mapColorIdToDifficulty(event.colorId)!;
        
        // Calculate duration
        const startTime = event.start?.dateTime ? new Date(event.start.dateTime) : new Date();
        const endTime = event.end?.dateTime ? new Date(event.end.dateTime) : new Date();
        const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

        return {
          user_id: user.id,
          google_event_id: event.id,
          title: event.summary,
          description: event.description || null,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          duration_minutes: durationMinutes,
          color_indicator: difficulty,
          // We don't overwrite is_completed if the task already exists, so we only specify it on insert
          // But Supabase upsert will overwrite if we provide it. We'll handle this by ignoring it or 
          // doing a more complex merge if needed. For now, upsert will overwrite.
          // To prevent overwriting is_completed, we can just insert and ignore conflicts, 
          // or fetch existing and merge. Let's do an upsert but rely on DB trigger or just fetch existing first.
        };
      });

    if (tasksToUpsert.length === 0) {
      return { success: true, count: 0 };
    }

    // Fetch existing tasks to preserve their completion state
    const { data: existingTasks } = await supabase
      .from('tasks')
      .select('google_event_id, is_completed')
      .in('google_event_id', tasksToUpsert.map(t => t.google_event_id));

    const existingMap = new Map(existingTasks?.map(t => [t.google_event_id, t.is_completed]) || []);

    const finalTasksToUpsert = tasksToUpsert.map(task => ({
      ...task,
      is_completed: existingMap.has(task.google_event_id) ? existingMap.get(task.google_event_id) : false,
    }));

    const { error } = await supabase
      .from('tasks')
      .upsert(finalTasksToUpsert, { onConflict: 'google_event_id' });

    if (error) {
      throw error;
    }

    return { success: true, count: finalTasksToUpsert.length };
  } catch (error: any) {
    console.error("Failed to sync tasks:", error);
    return { success: false, error: error.message };
  }
}
