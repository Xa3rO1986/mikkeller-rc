import { useState, useMemo } from "react";
import EventCard from "@/components/EventCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import type { Event, Location } from "@shared/schema";
import { formatEventType } from "@shared/constants/eventTypes";

export default function Events() {
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  const { data: upcomingEvents = [], isLoading: upcomingLoading } = useQuery<Event[]>({
    queryKey: ['/api/events?upcoming=true'],
  });

  const { data: allEvents = [], isLoading: allLoading } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['/api/locations'],
  });

  const pastEvents = allEvents.filter(event => new Date(event.startsAt) < new Date());

  const filteredUpcomingEvents = useMemo(() => {
    return upcomingEvents.filter(event => {
      const matchesEventType = eventTypeFilter === "all" || event.eventType === eventTypeFilter;
      const matchesLocation = locationFilter === "all" || event.locationId === locationFilter;
      return matchesEventType && matchesLocation;
    });
  }, [upcomingEvents, eventTypeFilter, locationFilter]);

  const filteredPastEvents = useMemo(() => {
    return pastEvents.filter(event => {
      const matchesEventType = eventTypeFilter === "all" || event.eventType === eventTypeFilter;
      const matchesLocation = locationFilter === "all" || event.locationId === locationFilter;
      return matchesEventType && matchesLocation;
    });
  }, [pastEvents, eventTypeFilter, locationFilter]);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <Breadcrumbs items={[{ label: "Забеги" }]} />
        
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Забеги</h1>
          <p className="text-lg text-muted-foreground">
            Присоединяйтесь к нашим еженедельным забегам в Москве
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="mb-8">
          <TabsList>
            <TabsTrigger value="upcoming" data-testid="tab-upcoming">Предстоящие</TabsTrigger>
            <TabsTrigger value="past" data-testid="tab-past">Прошедшие</TabsTrigger>
          </TabsList>

          <div className="mt-6 mb-8">
            <div className="flex flex-wrap gap-4">
              <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-event-type">
                  <SelectValue placeholder="Тип события" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="club">{formatEventType("club")}</SelectItem>
                  <SelectItem value="irregular">{formatEventType("irregular")}</SelectItem>
                  <SelectItem value="city">{formatEventType("city")}</SelectItem>
                  <SelectItem value="out_of_town">{formatEventType("out_of_town")}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[200px]" data-testid="select-location">
                  <SelectValue placeholder="Локация" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все локации</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setEventTypeFilter("all");
                  setLocationFilter("all");
                }}
                data-testid="button-reset-filters"
              >
                Сбросить фильтры
              </Button>
            </div>
          </div>

          <TabsContent value="upcoming">
            {upcomingLoading ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Загрузка событий...</p>
              </div>
            ) : filteredUpcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUpcomingEvents.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  {eventTypeFilter === "all" && locationFilter === "all" 
                    ? "Предстоящие забеги скоро появятся" 
                    : "Нет событий, соответствующих выбранным фильтрам"}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {allLoading ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Загрузка событий...</p>
              </div>
            ) : filteredPastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPastEvents.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  {eventTypeFilter === "all" && locationFilter === "all" 
                    ? "Прошедших забегов пока нет" 
                    : "Нет событий, соответствующих выбранным фильтрам"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
