import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Clock, ThumbsUp, Sparkles, AlertTriangle } from "lucide-react"
import FeaturedEventCard from "@/components/featured-event-card"
import EventCard from "@/components/event-card"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { EventWithCategory } from "@/lib/types"

function isThisWeekend(dateStr: string): boolean {
  const eventDate = new Date(dateStr);
  const today = new Date();
  const currentDay = today.getDay(); // 0 (Sun) to 6 (Sat)

  // Adjust today to be the start of the current day for accurate comparison
  today.setHours(0, 0, 0, 0);

  // Calculate days until Friday
  let daysUntilFriday = 5 - currentDay;
  if (currentDay > 5) { // If it's Saturday or Sunday already
    daysUntilFriday = 5 + (7 - currentDay); // Days until next Friday
  }
  if (daysUntilFriday < 0) daysUntilFriday +=7; // handles if today is Friday, Sat, Sun

  const friday = new Date(today);
  friday.setDate(today.getDate() + daysUntilFriday);

  const sunday = new Date(friday);
  sunday.setDate(friday.getDate() + 2);
  sunday.setHours(23, 59, 59, 999); // End of Sunday

  return eventDate >= friday && eventDate <= sunday;
}

export default async function Home() {
  const supabase = createSupabaseServerClient()
  let allEvents: EventWithCategory[] = []
  let fetchError: string | null = null

  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_categories ( name )
      `)
      .eq('is_approved', true)
      .order('event_date', { ascending: true });

    if (error) {
      console.error("Supabase fetch error:", error);
      fetchError = "Could not fetch events at this time. Please try again later.";
    } else {
      allEvents = data as EventWithCategory[] || [];
    }
  } catch (e) {
    console.error("Error fetching events:", e);
    fetchError = "An unexpected error occurred while fetching events.";
  }

  const featuredEvents = allEvents.slice(0, 3);

  const thisWeekendEvents = allEvents.filter(event => event.event_date && isThisWeekend(event.event_date)).slice(0, 4);
  
  const freeEvents = allEvents.filter((event) => event.is_free).slice(0, 4);
  
  const trendingEvents = allEvents.filter(event => event.description && event.description.length > 10).slice(0, 4);

  const surpriseEvent = allEvents.length > 0 ? allEvents[Math.floor(Math.random() * allEvents.length)] : null;

  if (fetchError) {
    return (
      <div className="container mx-auto px-4 py-8 dark:bg-background dark:text-foreground flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-destructive">Error Fetching Events</h2>
        <p className="text-muted-foreground">{fetchError}</p>
        <Button asChild className="mt-6">
          <Link href="/">Try Again</Link>
        </Button>
      </div>
    );
  }
  
  if (allEvents.length === 0 && !fetchError) {
     return (
      <div className="container mx-auto px-4 py-8 dark:bg-background dark:text-foreground flex flex-col items-center justify-center min-h-[60vh]">
        <Sparkles className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Events Yet</h2>
        <p className="text-muted-foreground text-center">
          It looks like there are no events scheduled right now. <br/>
          Be the first to <Link href="/submit" className="text-primary hover:underline">add one</Link> or check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-background dark:text-foreground">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Welcome to VibeCulture
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Discover hyper-local cultural events in New York.
        </p>
      </header>

      <section className="text-center">
        <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
        <p className="mb-4 text-muted-foreground">
          Explore the latest cultural happenings in the city.
        </p>
        <Button asChild size="lg">
          <Link href="/events">Browse All Events</Link>
        </Button>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Discover Authentic Cultural Experiences
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Find the best local events, from art exhibitions to music performances, curated by the community for New York.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/discover">Explore Events</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/submit">Submit an Event</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {featuredEvents.length > 0 && (
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Featured Events</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredEvents.map((event) => (
                  <FeaturedEventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {(thisWeekendEvents.length > 0 || freeEvents.length > 0 || trendingEvents.length > 0) && (
        <section className="w-full py-12 md:py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue={thisWeekendEvents.length > 0 ? "weekend" : freeEvents.length > 0 ? "free" : "trending"} className="w-full">
              <div className="flex items-center justify-between mb-8 flex-wrap">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl mb-4 md:mb-0">Discover Events</h2>
                <TabsList>
                  {thisWeekendEvents.length > 0 && <TabsTrigger value="weekend">This Weekend</TabsTrigger>}
                  {freeEvents.length > 0 && <TabsTrigger value="free">Free Events</TabsTrigger>}
                  {trendingEvents.length > 0 && <TabsTrigger value="trending">Trending</TabsTrigger>}
                </TabsList>
              </div>
              {thisWeekendEvents.length > 0 && (
                <TabsContent value="weekend" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {thisWeekendEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </TabsContent>
              )}
              {freeEvents.length > 0 && (
                <TabsContent value="free" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {freeEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </TabsContent>
              )}
              {trendingEvents.length > 0 && (
                <TabsContent value="trending" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {trendingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </section>
      )}

      {surpriseEvent && (
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Surprise Me!</h2>
              </div>
              <Card className="overflow-hidden dark:bg-card">
                <div className="md:grid md:grid-cols-2">
                  <div className="relative aspect-video md:aspect-auto">
                    <img
                      src={surpriseEvent.image_url || "/placeholder.svg?height=400&width=600"}
                      alt={surpriseEvent.title}
                      className="object-cover w-full h-full"
                    />
                    {surpriseEvent.communityPick && (
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">Community Pick</Badge>
                    )}
                  </div>
                  <div className="p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold">{surpriseEvent.title}</h3>
                        <p className="text-muted-foreground line-clamp-3">{surpriseEvent.description}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {surpriseEvent.venue_name || "N/A"}, {surpriseEvent.address || surpriseEvent.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {surpriseEvent.event_date ? new Date(surpriseEvent.event_date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            }) : "Date N/A"}
                          </span>
                        </div>
                        {surpriseEvent.start_time && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{surpriseEvent.start_time.substring(0,5)}{surpriseEvent.end_time ? ` - ${surpriseEvent.end_time.substring(0,5)}` : ""}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      {typeof surpriseEvent.votes === 'number' && (
                         <div className="flex items-center gap-2">
                           <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                           <span className="text-sm text-muted-foreground">{surpriseEvent.votes} people interested</span>
                         </div>
                      )}
                      <Button asChild>
                        <Link href={`/events/${surpriseEvent.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Organizing an Event?</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Share your cultural event with our community and reach more attendees.
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="/submit">Submit Your Event</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
