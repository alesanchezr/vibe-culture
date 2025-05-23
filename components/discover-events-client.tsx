"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Keep if used for specific boolean filters
import { CalendarIcon, Search, Filter, AlertTriangle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import EventCard from "@/components/event-card";
import type { EventWithCategory, EventCategory } from "@/lib/types";

interface DiscoverEventsClientProps {
  initialEvents: EventWithCategory[];
  categories: EventCategory[];
  fetchError: string | null;
}

export default function DiscoverEventsClient({ 
  initialEvents, 
  categories: availableCategories, 
  fetchError 
}: DiscoverEventsClientProps) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string>("all-categories"); // Stores category ID or "all-categories"
  const [priceFilter, setPriceFilter] = useState<string>("any-price"); // "any-price", "free", "paid"
  // Location filter might be less relevant if all events are in "New York" for MVP
  // const [location, setLocation] = useState<string>("all-locations"); 
  const [filteredEvents, setFilteredEvents] = useState<EventWithCategory[]>(initialEvents);
  
  // For potential future boolean filters like 'featured' or 'communityPick'
  // const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  // const [showCommunityPicks, setShowCommunityPicks] = useState(false);

  // Initialize filters from URL params (if any)
  useEffect(() => {
    const categoryParam = searchParams.get("category"); // expecting category name or ID
    if (categoryParam) {
      const foundCategory = availableCategories.find(c => c.name.toLowerCase() === categoryParam.toLowerCase() || String(c.id) === categoryParam);
      if (foundCategory) {
        setCategoryFilter(String(foundCategory.id));
      }
    }
    // Add other param initializations if needed (e.g., search term)
    const searchParam = searchParams.get("q");
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams, availableCategories]);

  // Apply filters when dependencies change
  useEffect(() => {
    let results = [...initialEvents];

    // Search term filter (title and description)
    if (searchTerm) {
      results = results.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Date filter
    if (date) {
      results = results.filter((event) => {
        if (!event.event_date) return false;
        const eventDate = new Date(event.event_date);
        // Compare date part only, ignoring time
        return eventDate.toDateString() === date.toDateString();
      });
    }

    // Category filter
    if (categoryFilter !== "all-categories") {
      results = results.filter((event) => String(event.category_id) === categoryFilter);
    }

    // Price filter
    if (priceFilter === "free") {
      results = results.filter((event) => event.is_free);
    } else if (priceFilter === "paid") {
      results = results.filter((event) => !event.is_free);
    }

    // Location filter (currently simplified as all are 'New York' for MVP)
    // if (location !== "all-locations") {
    //   results = results.filter((event) => event.city.toLowerCase().includes(location.toLowerCase()));
    // }

    // Placeholder for featured/community pick if these fields get added to EventWithCategory
    // if (showFeaturedOnly) {
    //   results = results.filter((event) => event.featured);
    // }
    // if (showCommunityPicks) {
    //   results = results.filter((event) => event.communityPick);
    // }

    setFilteredEvents(results);
  }, [searchTerm, date, categoryFilter, priceFilter, initialEvents]);

  // const uniqueLocations = useMemo(() => Array.from(new Set(initialEvents.map((event) => event.city))),[initialEvents]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setDate(undefined);
    setCategoryFilter("all-categories");
    setPriceFilter("any-price");
    // setLocation("all-locations");
    // setShowFeaturedOnly(false);
    // setShowCommunityPicks(false);
  };
  
  if (fetchError) {
    return (
      <div className="container mx-auto px-4 py-8 dark:bg-background dark:text-foreground flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-destructive">Error Loading Events</h2>
        <p className="text-muted-foreground text-center">{fetchError}</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 dark:bg-background dark:text-foreground">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Discover Events</h1>
          <p className="text-muted-foreground">Find and explore authentic cultural experiences in New York.</p>
        </div>

        {/* Search and Filters - Desktop */}
        <div className="hidden md:flex items-end gap-4 p-4 border rounded-lg dark:border-gray-700">
          <div className="grid flex-grow items-center gap-1.5">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                id="search"
                placeholder="Search by keyword..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid items-center gap-1.5">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid items-center gap-1.5">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category" className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}> {/* Use ID for value */}
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid items-center gap-1.5">
            <Label htmlFor="price">Price</Label>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger id="price" className="w-[150px]">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any-price">Any Price</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Location filter removed for MVP simplicity, can be added back if needed
          <div className="grid items-center gap-1.5">
            <Label htmlFor="location">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location" className="w-[200px]">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-locations">All Locations</SelectItem>
                {uniqueLocations.map((loc) => (
                  <SelectItem key={loc} value={loc.toLowerCase()}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          */}
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="self-end"
          >
            Reset
          </Button>
        </div>

        {/* Search and Filters - Mobile (Sheet) */}
        <div className="flex md:hidden items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Open filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Events</SheetTitle>
                <SheetDescription>Adjust your preferences to find the perfect event.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-6 py-6">
                <div className="grid gap-2">
                  <Label htmlFor="mobile-date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="mobile-date"
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="mobile-category">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger id="mobile-category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-categories">All Categories</SelectItem>
                      {availableCategories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="mobile-price">Price</Label>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger id="mobile-price">
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any-price">Any Price</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Mobile Location Filter - removed for MVP
                <div className="grid gap-2">
                  <Label htmlFor="mobile-location">Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="mobile-location">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-locations">All Locations</SelectItem>
                      {uniqueLocations.map((loc) => (
                        <SelectItem key={loc} value={loc.toLowerCase()}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                */}
                 <Button
                    variant="ghost"
                    onClick={handleResetFilters}
                    className="w-full justify-center"
                  >
                    Reset Filters
                  </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Event Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No events match your current filters.</p>
            <Button variant="link" onClick={handleResetFilters} className="mt-2">
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 