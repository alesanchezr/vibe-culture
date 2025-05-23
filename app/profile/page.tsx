"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { mockEvents } from "@/lib/mock-data"
import EventCard from "@/components/event-card"

export default function ProfilePage() {
  const [savedEvents, setSavedEvents] = useState(mockEvents.slice(0, 4))
  const [pastEvents, setPastEvents] = useState(mockEvents.slice(4, 6))

  // Mock user preferences
  const [preferences, setPreferences] = useState({
    categories: ["Music", "Art", "Theater"],
    locations: ["Downtown", "Midtown"],
    notifications: {
      email: true,
      browser: false,
    },
  })

  const handleRemoveSavedEvent = (eventId: number) => {
    setSavedEvents(savedEvents.filter((event) => event.id !== eventId))
  }

  const categories = ["Music", "Art", "Theater", "Dance", "Film", "Food", "Literature", "Festival", "Workshop"]

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">User Profile</h1>
              <p className="text-muted-foreground">user@example.com</p>
            </div>
          </div>
          <Button>Edit Profile</Button>
        </div>

        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="saved">Saved Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="mt-6">
            <div className="grid gap-6">
              <h2 className="text-xl font-semibold">Saved Events</h2>
              {savedEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {savedEvents.map((event) => (
                    <div key={event.id} className="relative group">
                      <EventCard event={event} />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveSavedEvent(event.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">You haven't saved any events yet.</p>
                    <Button asChild className="mt-4">
                      <a href="/discover">Discover Events</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            <div className="grid gap-6">
              <h2 className="text-xl font-semibold">Past Events</h2>
              {pastEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">You haven't attended any events yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <div className="grid gap-8 max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Interests</CardTitle>
                  <CardDescription>
                    Select the types of events you're interested in to get personalized recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <h3 className="mb-4 text-sm font-medium">Event Categories</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={preferences.categories.includes(category)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setPreferences({
                                    ...preferences,
                                    categories: [...preferences.categories, category],
                                  })
                                } else {
                                  setPreferences({
                                    ...preferences,
                                    categories: preferences.categories.filter((c) => c !== category),
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={`category-${category}`}>{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location Preferences</CardTitle>
                  <CardDescription>Select your preferred areas to discover nearby events.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {["Downtown", "Midtown", "Uptown", "West Side", "East Side", "Suburbs"].map((location) => (
                        <div key={location} className="flex items-center space-x-2">
                          <Checkbox
                            id={`location-${location}`}
                            checked={preferences.locations.includes(location)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setPreferences({
                                  ...preferences,
                                  locations: [...preferences.locations, location],
                                })
                              } else {
                                setPreferences({
                                  ...preferences,
                                  locations: preferences.locations.filter((l) => l !== location),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={`location-${location}`}>{location}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive updates about events.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="email-notifications"
                        checked={preferences.notifications.email}
                        onCheckedChange={(checked) => {
                          setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              email: checked as boolean,
                            },
                          })
                        }}
                      />
                      <Label htmlFor="email-notifications">Email notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="browser-notifications"
                        checked={preferences.notifications.browser}
                        onCheckedChange={(checked) => {
                          setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              browser: checked as boolean,
                            },
                          })
                        }}
                      />
                      <Label htmlFor="browser-notifications">Browser notifications</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
