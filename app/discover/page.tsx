import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EventWithCategory, EventCategory } from "@/lib/types";
import DiscoverEventsClient from "@/components/discover-events-client"; // New client component

export default async function DiscoverPage() {
  const supabase = createSupabaseServerClient();
  let initialEvents: EventWithCategory[] = [];
  let categories: EventCategory[] = [];
  let fetchError: string | null = null;

  try {
    const [eventsResponse, categoriesResponse] = await Promise.all([
      supabase
        .from('events')
        .select('*, event_categories(name)')
        .eq('is_approved', true)
        .order('event_date', { ascending: true }),
      supabase
        .from('event_categories')
        .select('*')
        .order('name', { ascending: true }),
    ]);

    if (eventsResponse.error) {
      console.error("Supabase fetch error (events):", eventsResponse.error);
      fetchError = "Could not fetch events. ";
    } else {
      initialEvents = (eventsResponse.data as EventWithCategory[]) || [];
    }

    if (categoriesResponse.error) {
      console.error("Supabase fetch error (categories):", categoriesResponse.error);
      fetchError += "Could not fetch categories."; // Append to existing error message if any
    } else {
      categories = (categoriesResponse.data as EventCategory[]) || [];
    }

  } catch (e) {
    console.error("Error fetching discover page data:", e);
    fetchError = "An unexpected error occurred while fetching data.";
  }

  return (
    <DiscoverEventsClient 
      initialEvents={initialEvents} 
      categories={categories}
      fetchError={fetchError}
    />
  );
}
