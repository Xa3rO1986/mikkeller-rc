import { useState } from "react";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@shared/schema";

export default function Events() {
  const [distanceFilter, setDistanceFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  const { data: upcomingEvents = [], isLoading: upcomingLoading } = useQuery<Event[]>({
    queryKey: ['/api/events?upcoming=true'],
  });

  const { data: allEvents = [], isLoading: allLoading } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const pastEvents = allEvents.filter(event => new Date(event.startsAt) < new Date());

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
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
              <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-distance">
                  <SelectValue placeholder="Дистанция" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все дистанции</SelectItem>
                  <SelectItem value="5">5 км</SelectItem>
                  <SelectItem value="10">10 км</SelectItem>
                  <SelectItem value="15">15+ км</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-location">
                  <SelectValue placeholder="Локация" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все локации</SelectItem>
                  <SelectItem value="park">Парки</SelectItem>
                  <SelectItem value="river">Набережные</SelectItem>
                  <SelectItem value="trail">Трейлы</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setDistanceFilter("all");
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
            ) : upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Предстоящие забеги скоро появятся</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {allLoading ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Загрузка событий...</p>
              </div>
            ) : pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Прошедших забегов пока нет</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
