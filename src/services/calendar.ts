export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start?: { dateTime?: string; date?: string; timeZone?: string };
  end?: { dateTime?: string; date?: string; timeZone?: string };
  colorId?: string;
  status: string;
}

export type TaskDifficulty = "hard" | "medium" | "easy" | "sleep";

// Map Google Calendar colorIds to our system's difficulty levels
export const mapColorIdToDifficulty = (colorId?: string): TaskDifficulty | null => {
  switch (colorId) {
    case "11": // Tomato / Red
      return "hard";
    case "6": // Tangerine / Orange
      return "medium";
    case "9": // Blueberry / Blue
      return "easy";
    case "3": // Grape / Purple
      return "sleep";
    default:
      return null; // Ignore all other colors
  }
};

export async function fetchCalendarEvents(providerToken: string, timeMin: string, timeMax: string): Promise<GoogleCalendarEvent[]> {
  const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
  url.searchParams.append('timeMin', timeMin);
  url.searchParams.append('timeMax', timeMax);
  url.searchParams.append('singleEvents', 'true');
  url.searchParams.append('orderBy', 'startTime');

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${providerToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch calendar events: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || [];
}
