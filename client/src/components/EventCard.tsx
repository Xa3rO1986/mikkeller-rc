import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, TrendingUp, Route } from "lucide-react";
import { Link } from "wouter";
import type { Event, Location } from "@shared/schema";
import { formatRussianDate, formatRussianMonth } from "@/lib/date-utils";
import { formatEventType } from "@shared/constants/eventTypes";
import { useQuery } from "@tanstack/react-query";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.startsAt);
  
  const { data: location } = useQuery<Location>({
    queryKey: ["/api/locations", event.locationId],
    enabled: !!event.locationId,
  });

  const locationText = location?.name || event.address || 'Место уточняется';
  
  return (
    <Card className="overflow-hidden hover:-translate-y-1 transition-transform border-2 border-black" data-testid={`card-event-${event.slug}`}>
      <div className="relative h-48 overflow-hidden bg-muted flex items-center justify-center">
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm px-4">Изображение скоро появится</p>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold text-xl flex-1">{event.title}</h3>
          {event.eventType && (
            <Badge variant="outline" className="text-xs whitespace-nowrap" data-testid={`badge-event-type-${event.slug}`}>
              {formatEventType(event.eventType)}
            </Badge>
          )}
        </div>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatRussianDate(eventDate, { includeYear: true })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{locationText}</span>
          </div>
          {event.distanceKm && (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>{event.distanceKm} км</span>
            </div>
          )}
          {event.gpxUrl && (
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              <span>GPX маршрут доступен</span>
            </div>
          )}
        </div>

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Link href={`/events/${event.slug}`}>
          <Button className="w-full" data-testid={`button-event-${event.slug}`}>
            Подробнее
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
