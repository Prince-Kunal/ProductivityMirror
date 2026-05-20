// Google Calendar Write Service
// Requires full calendar scope (not readonly)

export interface CreateEventPayload {
  summary: string;
  description?: string;
  start: string; // ISO datetime
  end: string;   // ISO datetime
  colorId?: string;
}

export async function createCalendarEvent(providerToken: string, payload: CreateEventPayload) {
  const body = {
    summary: payload.summary,
    description: payload.description,
    start: { dateTime: payload.start, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    end: { dateTime: payload.end, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    ...(payload.colorId ? { colorId: payload.colorId } : {}),
  };

  const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${providerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `Failed to create event: ${res.statusText}`);
  }
  return res.json();
}

export async function updateCalendarEvent(providerToken: string, eventId: string, payload: Partial<CreateEventPayload>) {
  const body: any = {};
  if (payload.summary) body.summary = payload.summary;
  if (payload.description !== undefined) body.description = payload.description;
  if (payload.start) body.start = { dateTime: payload.start, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
  if (payload.end) body.end = { dateTime: payload.end, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
  if (payload.colorId) body.colorId = payload.colorId;

  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${providerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `Failed to update event: ${res.statusText}`);
  }
  return res.json();
}

export async function deleteCalendarEvent(providerToken: string, eventId: string) {
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${providerToken}` },
  });

  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to delete event: ${res.statusText}`);
  }
}
