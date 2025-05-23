"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Clock, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { mockEvents } from "@/lib/mock-data"

export default function SubmitEventPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const categories = Array.from(new Set(mockEvents.map((event) => event.category)))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSuccess(true)

    // Redirect after success
    setTimeout(() => {
      router.push("/discover")
    }, 2000)
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Submit an Event</h1>
          <p className="text-muted-foreground">
            Share your cultural event with our community and reach more attendees.
          </p>
        </div>

        {isSuccess ? (
          <Card>
            <CardHeader>
              <CardTitle>Event Submitted Successfully!</CardTitle>
              <CardDescription>Thank you for sharing your event with our community.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Your event has been submitted for review. Once approved, it will appear in our event listings. You will
                be redirected to the discover page shortly.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href="/discover">Return to Events</a>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Provide the basic information about your event.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input id="title" placeholder="Enter the name of your event" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your event in detail"
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image">Event Image</Label>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Recommended size: 1200x800px. Max file size: 5MB.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Date & Time</CardTitle>
                <CardDescription>When will your event take place?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select event date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="time">Time *</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Select required>
                      <SelectTrigger id="time-hour" className="w-[110px]">
                        <SelectValue placeholder="Hour" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                          <SelectItem key={hour} value={hour.toString()}>
                            {hour.toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span>:</span>
                    <Select required>
                      <SelectTrigger id="time-minute" className="w-[110px]">
                        <SelectValue placeholder="Minute" />
                      </SelectTrigger>
                      <SelectContent>
                        {["00", "15", "30", "45"].map((minute) => (
                          <SelectItem key={minute} value={minute}>
                            {minute}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select required>
                      <SelectTrigger id="time-period" className="w-[110px]">
                        <SelectValue placeholder="AM/PM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="am">AM</SelectItem>
                        <SelectItem value="pm">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location & Price</CardTitle>
                <CardDescription>Where will your event take place and how much does it cost?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="venue">Venue Name *</Label>
                  <Input id="venue" placeholder="Enter the venue name" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input id="address" placeholder="Enter the full address" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" placeholder="Enter the city" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="price-type">Price *</Label>
                  <Select required>
                    <SelectTrigger id="price-type">
                      <SelectValue placeholder="Select price type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="ticket-url">Ticket URL</Label>
                  <Input id="ticket-url" placeholder="Enter the URL where people can buy tickets" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organizer Information</CardTitle>
                <CardDescription>Tell us about who's organizing this event.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="organizer-name">Organizer Name *</Label>
                  <Input id="organizer-name" placeholder="Enter the name of the organizer" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="organizer-email">Email *</Label>
                  <Input id="organizer-email" type="email" placeholder="Enter your email address" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="organizer-phone">Phone Number</Label>
                  <Input id="organizer-phone" placeholder="Enter your phone number" />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Event"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
