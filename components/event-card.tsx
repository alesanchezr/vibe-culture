import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, ThumbsUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EventWithCategory } from "@/lib/types"

interface EventCardProps {
  event: EventWithCategory
  className?: string
}

export default function EventCard({ event, className }: EventCardProps) {
  let formattedDate = "N/A";
  if (event.event_date) {
    try {
      formattedDate = new Date(event.event_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      console.error("Invalid date format for event_date:", event.event_date);
    }
  }

  const displayPrice = event.is_free ? "Free" : event.price_info || "N/A";

  return (
    <Link href={`/events/${event.id}`} className="block h-full">
      <Card className={cn("h-full overflow-hidden transition-all hover:shadow-md dark:bg-card dark:text-card-foreground", className)}>
        <div className="relative aspect-[4/3]">
          <img
            src={event.image_url || "/placeholder.svg?height=300&width=400"}
            alt={event.title}
            className="object-cover w-full h-full"
          />
          {event.communityPick && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">Community Pick</Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{event.event_categories?.name || "General"}</Badge>
              <span className="text-sm font-medium">{displayPrice}</span>
            </div>
            <h3 className="font-semibold line-clamp-1">{event.title}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
              <span className="mx-1">•</span>
              <MapPin className="h-3 w-3" />
              <span className="truncate">{event.venue_name || "N/A"}</span>
            </div>
          </div>
        </CardContent>
        {typeof event.votes === 'number' && (
          <CardFooter className="p-4 pt-0">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ThumbsUp className="h-3 w-3" />
              <span>{event.votes} interested</span>
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}
