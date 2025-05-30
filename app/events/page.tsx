import EventCard from '@/components/event-card';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import type { EventWithCategory } from '@/lib/types';

export default async function EventsPage() {
  const cookieStore = cookies();
  const supabase = await createSupabaseServerClient();

  const { data: events, error } = await supabase
    .from('events')
    .select(`
      id,
      title,
      description,
      event_date,
      start_time,
      end_time,
      venue_name,
      address,
      city,
      latitude,
      longitude,
      category_id,
      price_info,
      is_free,
      organizer_name,
      organizer_contact,
      source_url,
      image_url,
      created_by,
      is_approved,
      created_at,
      updated_at,
      event_categories (id, name)
    `)
    .eq('is_approved', true)
    .eq('city', 'Miami') // Assuming Miami is the MVP city as per plan
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    // Optionally, render an error message to the user
    return <p>Error loading events. Please try again later.</p>;
  }

  if (!events || events.length === 0) {
    return <p>No events found in Miami at the moment. Check back soon!</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Upcoming Events in Miami</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event as any} />
        ))}
      </div>
    </div>
  );
} 