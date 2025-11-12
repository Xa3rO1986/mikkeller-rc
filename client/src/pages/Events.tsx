import { useState } from "react";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import event1 from '@assets/generated_images/Riverside_10k_route_cover_17dba083.png';
import event2 from '@assets/generated_images/Forest_trail_15k_cover_f2cdae95.png';
import event3 from '@assets/generated_images/Urban_park_5k_cover_f65fbe07.png';

export default function Events() {
  const [distanceFilter, setDistanceFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  const events = [
    {
      slug: "riverside-10k",
      title: "Забег вдоль набережной",
      date: "2024-12-20T10:00:00",
      location: "Набережная, Москва",
      distance: 10,
      elevation: 50,
      coverImage: event1,
      status: "open" as const,
      tags: ["10км", "городской", "набережная"],
    },
    {
      slug: "forest-trail-15k",
      title: "Лесной трейл",
      date: "2024-12-27T09:00:00",
      location: "Лесопарк, Москва",
      distance: 15,
      elevation: 280,
      coverImage: event2,
      status: "upcoming" as const,
      tags: ["15км", "трейл", "природа"],
    },
    {
      slug: "urban-park-5k",
      title: "Пробежка в парке",
      date: "2025-01-10T10:00:00",
      location: "Парк Горького, Москва",
      distance: 5,
      coverImage: event3,
      status: "upcoming" as const,
      tags: ["5км", "парк", "легко"],
    },
  ];

  const pastEvents = [
    {
      slug: "autumn-run-2024",
      title: "Осенний забег 2024",
      date: "2024-10-15T10:00:00",
      location: "Центральный парк, Москва",
      distance: 10,
      elevation: 30,
      coverImage: event1,
      status: "closed" as const,
      tags: ["10км", "осень", "парк"],
    },
  ];

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.slug} {...event} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.slug} {...event} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
