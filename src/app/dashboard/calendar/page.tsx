import { createClient } from "@/utils/supabase/server";
import CalendarView from "@/components/CalendarView";

export default async function CalendarPage() {
  const supabase = await createClient();

  // Fetch tasks for the next 2 months + last 1 month for calendar display
  const from = new Date();
  from.setMonth(from.getMonth() - 1);
  from.setHours(0, 0, 0, 0);

  const to = new Date();
  to.setMonth(to.getMonth() + 2);
  to.setHours(23, 59, 59, 999);

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .gte("start_time", from.toISOString())
    .lte("start_time", to.toISOString())
    .order("start_time", { ascending: true });

  return <CalendarView initialEvents={tasks || []} />;
}
