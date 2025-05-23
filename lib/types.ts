export interface EventCategory {
  id: number;
  name: string;
}

export interface Event {
  id: string; // UUID
  title: string;
  description: string | null;
  event_date: string; // Date string YYYY-MM-DD
  start_time: string | null; // Time string HH:MM:SS
  end_time: string | null; // Time string HH:MM:SS
  venue_name: string | null;
  address: string | null;
  city: string;
  latitude: number | null;
  longitude: number | null;
  category_id: number | null;
  event_categories?: EventCategory | null; // For joined data from Supabase
  price_info: string | null;
  is_free: boolean | null;
  organizer_name: string | null;
  organizer_contact: string | null;
  source_url: string | null;
  image_url: string | null;
  created_by: string | null; // UUID
  is_approved: boolean | null;
  created_at: string; // Timestamp string
  updated_at: string; // Timestamp string

  // Potential fields from your mock data to consider adding to Supabase 'events' table
  // or deriving/joining if they come from other tables (like upvotes/community_pick)
  featured?: boolean; // If you want to explicitly mark events as featured in DB
  votes?: number; // This would likely come from event_upvotes count
  communityPick?: boolean; // Derived from votes or another mechanism
}

// Helper type for Supabase client calls if you join categories
export type EventWithCategory = Event & {
  event_categories: { name: string } | null;
};
