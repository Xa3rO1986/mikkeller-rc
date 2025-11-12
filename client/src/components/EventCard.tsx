import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import type { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.startsAt);
  
  return (
    <Card className="overflow-hidden hover:-translate-y-1 transition-transform border-2 border-black" data-testid={`card-event-${event.slug}`}>
      <div className="relative h-48 overflow-hidden bg-muted flex items-center justify-center">
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="w-full h-full object-cover grayscale"
          />
        ) : (
          <div className="text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm px-4">Изображение скоро появится</p>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-black text-white rounded-md px-4 py-2 flex flex-col items-center justify-center font-bold">
          <span className="text-2xl">{eventDate.getDate()}</span>
          <span className="text-xs">{eventDate.toLocaleDateString('ru', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="font-bold text-xl mb-3">{event.title}</h3>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{eventDate.toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.address}</span>
          </div>
          {(event.distanceKm || event.elevationGain) && (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>
                {event.distanceKm && `${event.distanceKm} км`}
                {event.distanceKm && event.elevationGain && ' • '}
                {event.elevationGain && `${event.elevationGain}м набор`}
              </span>
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
