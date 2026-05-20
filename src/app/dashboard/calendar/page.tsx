import { createClient } from "@/utils/supabase/server";
import CalendarView from "@/components/CalendarView";

import { getStartOfDay, getEndOfDay } from "@/lib/date";
import { subMonths, addMonths } from "date-fns";

export default async function CalendarPage() {
  const supabase = await createClient();

  // Fetch tasks for the next 2 months + last 1 month for calendar display timezone-safely
  const now = new Date();
  const from = getStartOfDay(subMonths(now, 1));
  const to = getEndOfDay(addMonths(now, 2));

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .gte("start_time", from.toISOString())
    .lte("start_time", to.toISOString())
    .order("start_time", { ascending: true });

  return <CalendarView initialEvents={tasks || []} />;
}
