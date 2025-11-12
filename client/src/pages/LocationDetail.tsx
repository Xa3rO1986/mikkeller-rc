import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Location, Event } from "@shared/schema";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LocationDetail() {
  const { slug } = useParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  const { data: location, isLoading: locationLoading } = useQuery<Location>({
    queryKey: ["/api/locations/by-slug", slug],
    enabled: !!slug,
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  useEffect(() => {
    if (!location?.latitude || !location?.longitude || !mapRef.current) {
      return;
    }

    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
    }

    const map = L.map(mapRef.current).setView([location.latitude, location.longitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.marker([location.latitude, location.longitude], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<strong>${location.name}</strong><br>${location.address}`)
      .openPopup();

    leafletMapRef.current = map;

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [location]);

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
                ref={mapRef}
                className="w-full h-[400px] rounded-lg grayscale"
                data-testid="map-container"
              />
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
