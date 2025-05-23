import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock } from "lucide-react"
import type { EventWithCategory } from "@/lib/types"

interface FeaturedEventCardProps {
  event: EventWithCategory
}

export default function FeaturedEventCard({ event }: FeaturedEventCardProps) {
  let formattedDate = "Date not available";
  if (event.event_date) {
    try {
      formattedDate = new Date(event.event_date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.error("Invalid date format for event_date:", event.event_date);
    }
  }

  const displayPrice = event.is_free ? "Free" : event.price_info || "N/A";
  
  let displayTime = "Time not specified";
  if (event.start_time) {
    displayTime = event.start_time.substring(0, 5); // HH:MM
    if (event.end_time) {
      displayTime += ` - ${event.end_time.substring(0, 5)}`;
    }
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col dark:bg-card dark:text-card-foreground">
      <div className="relative aspect-video">
        <img
          src={event.image_url || "/placeholder.svg?height=300&width=500"}
          alt={event.title}
          className="object-cover w-full h-full"
        />
        {event.communityPick && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">Community Pick</Badge>
        )}
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{event.event_categories?.name || "General"}</Badge>
            <span className="text-sm font-medium">{displayPrice}</span>
          </div>
          <h3 className="font-bold text-lg">{event.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{displayTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {event.venue_name || "Venue not specified"}
                {event.address && `, ${event.address}`}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
