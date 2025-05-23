"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { mockEvents } from "@/lib/mock-data"
import EventCard from "@/components/event-card"

export default function SavedEventsPage() {
  const [savedEvents, setSavedEvents] = useState(mockEvents.slice(0, 6))

  const handleRemoveEvent = (eventId: number) => {
    setSavedEvents(savedEvents.filter((event) => event.id !== eventId))
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Saved Events</h1>
          <p className="text-muted-foreground">Events you've saved for later</p>
        </div>

        {savedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedEvents.map((event) => (
              <div key={event.id} className="relative group">
                <EventCard event={event} />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveEvent(event.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-medium mb-2">No saved events</h3>
              <p className="text-muted-foreground mb-6">
                You haven't saved any events yet. Browse events and save them for later.
              </p>
              <Button asChild>
                <Link href="/discover">Discover Events</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
