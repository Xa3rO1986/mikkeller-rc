import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Location, Event } from "@shared/schema";

export default function LocationDetail() {
  const { slug } = useParams();

  const { data: location, isLoading: locationLoading } = useQuery<Location>({
    queryKey: ["/api/locations", slug],
    enabled: !!slug,
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  if (locationLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-muted-foreground">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Локация не найдена</h1>
            <Link href="/">
              <Button variant="outline" data-testid="button-back-home">
                На главную
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const locationEvents = events.filter(event => event.locationId === location.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back">
              ← Назад
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4" data-testid="text-location-name">
              {location.name}
            </h1>
            
            <div className="flex items-start gap-2 text-muted-foreground mb-4">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p data-testid="text-location-address">{location.address}</p>
            </div>

            {location.description && (
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground/80" data-testid="text-location-description">
                  {location.description}
                </p>
              </div>
            )}
          </div>

          {location.latitude && location.longitude && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Расположение на карте</h2>
              <div 
                className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center"
                data-testid="map-container"
              >
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p>Координаты: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
                </div>
              </div>
            </Card>
          )}

          {locationEvents.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                События в этой локации
              </h2>
              <div className="space-y-3">
                {locationEvents.map(event => (
                  <Link key={event.id} href={`/events/${event.slug}`}>
                    <div 
                      className="p-4 rounded-lg border hover-elevate active-elevate-2 cursor-pointer"
                      data-testid={`event-card-${event.id}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1" data-testid={`text-event-title-${event.id}`}>
                            {event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.startsAt).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        {event.distanceKm && (
                          <div className="text-sm text-muted-foreground">
                            {event.distanceKm} км
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
