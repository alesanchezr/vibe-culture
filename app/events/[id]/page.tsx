"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, ThumbsUp, Share2, CalendarPlus, ExternalLink } from "lucide-react"
import { mockEvents } from "@/lib/mock-data"
import EventCard from "@/components/event-card"

export default function EventPage() {
  const params = useParams()
  const eventId = params.id as string
  const event = mockEvents.find((e) => e.id.toString() === eventId)

  const [isInterested, setIsInterested] = useState(false)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Alex Johnson",
      avatar: "/placeholder.svg",
      text: "I attended this last year and it was amazing! Highly recommend.",
      date: "2 days ago",
    },
    {
      id: 2,
      user: "Sam Rivera",
      avatar: "/placeholder.svg",
      text: "Does anyone know if they'll have food vendors this time?",
      date: "1 day ago",
    },
  ])

  // Find similar events (same category)
  const similarEvents = event
    ? mockEvents.filter((e) => e.category === event.category && e.id !== event.id).slice(0, 3)
    : []

  if (!event) {
    return (
      <div className="container px-4 py-12 md:px-6 text-center">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <p className="text-muted-foreground mt-2">The event you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="mt-4">
          <Link href="/discover">Discover Events</Link>
        </Button>
      </div>
    )
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const formattedPrice = event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          user: "You",
          avatar: "/placeholder.svg",
          text: comment,
          date: "Just now",
        },
      ])
      setComment("")
    }
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          {/* Event Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Link href="/discover" className="text-sm text-muted-foreground hover:underline">
                Events
              </Link>
              <span className="text-sm text-muted-foreground">/</span>
              <Link
                href={`/discover?category=${event.category}`}
                className="text-sm text-muted-foreground hover:underline"
              >
                {event.category}
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{event.title}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{event.category}</Badge>
                {event.communityPick && <Badge className="bg-primary text-primary-foreground">Community Pick</Badge>}
              </div>
            </div>
          </div>

          {/* Event Image */}
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <img
              src={event.image || "/placeholder.svg?height=500&width=800"}
              alt={event.title}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Event Tabs */}
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="discussion">Discussion ({comments.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-6">
              <div className="prose max-w-none">
                <p>{event.description}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl
                  nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl
                  nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.
                </p>
                <h3>What to expect</h3>
                <ul>
                  <li>Interactive exhibits and installations</li>
                  <li>Live performances throughout the day</li>
                  <li>Food and beverages available for purchase</li>
                  <li>Family-friendly activities</li>
                </ul>
                <p>Don't miss this opportunity to experience one of the city's most anticipated cultural events!</p>
              </div>

              {event.organizer && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Organizer</h3>
                  <p>{event.organizer}</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="discussion" className="space-y-6">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.user} />
                          <AvatarFallback>{comment.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{comment.user}</span>
                            <span className="text-xs text-muted-foreground">{comment.date}</span>
                          </div>
                          <p>{comment.text}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <form onSubmit={handleSubmitComment} className="space-y-4">
                <Textarea placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
                <Button type="submit" disabled={!comment.trim()}>
                  Post Comment
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        {/* Event Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">When & Where</h3>
                  <Badge>{formattedPrice}</Badge>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{formattedDate}</p>
                    <p className="text-muted-foreground">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{event.venue}</p>
                    <p className="text-muted-foreground">{event.location}</p>
                    <a
                      href={`https://maps.google.com/?q=${event.venue},${event.location}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      View on map
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  className={isInterested ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => setIsInterested(!isInterested)}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {isInterested ? "Interested" : "I'm Interested"}
                </Button>

                {event.ticketUrl && (
                  <Button asChild variant="outline">
                    <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {event.price === 0 ? "Register" : "Buy Tickets"}
                    </a>
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Add to Calendar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {event.votes + (isInterested ? 1 : 0)} people interested
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Similar Events */}
          {similarEvents.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Similar Events</h3>
              <div className="space-y-4">
                {similarEvents.map((event) => (
                  <EventCard key={event.id} event={event} className="h-auto" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
