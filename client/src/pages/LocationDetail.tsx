import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { Location, Event } from "@shared/schema";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function LocationDetail() {
  const { slug } = useParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [hasMapError, setHasMapError] = useState(false);

  const { data: location, isLoading: locationLoading } = useQuery<Location>({
    queryKey: ["/api/locations/by-slug", slug],
    enabled: !!slug,
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  useEffect(() => {
    if (!location?.latitude || !location?.longitude) {
      return;
    }

    const loadYandexMaps = () => {
      if (window.ymaps) {
        initMap();
        return;
      }

      const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;
      
      if (!apiKey) {
        setHasMapError(true);
        setIsMapLoading(false);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      
      script.onload = () => {
        try {
          window.ymaps.ready(() => {
            try {
              initMap();
            } catch (error) {
              console.error('Yandex Maps error:', error);
              setHasMapError(true);
              setIsMapLoading(false);
            }
          });
        } catch (error) {
          console.error('Yandex Maps error:', error);
          setHasMapError(true);
          setIsMapLoading(false);
        }
      };

      script.onerror = () => {
        setHasMapError(true);
        setIsMapLoading(false);
      };

      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      try {
        const map = new window.ymaps.Map(mapRef.current, {
          center: [location.latitude, location.longitude],
          zoom: 15,
          controls: ['zoomControl', 'searchControl'],
        }, {
          suppressMapOpenBlock: true,
        });

        mapInstanceRef.current = map;

        const placemark = new window.ymaps.Placemark([location.latitude, location.longitude], {
          balloonContent: `<strong>${location.name}</strong><br>${location.address}`,
          hintContent: location.name,
        }, {
          preset: 'islands#redDotIcon',
        });

        map.geoObjects.add(placemark);
        placemark.balloon.open();

        setIsMapLoading(false);
        setHasMapError(false);
      } catch (error) {
        console.error('Yandex Maps init error:', error);
        setHasMapError(true);
        setIsMapLoading(false);
      }
    };

    loadYandexMaps();

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
        } catch (error) {
          console.error('Error destroying map:', error);
        }
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
        <Breadcrumbs items={[
          { label: "Локации", href: "/locations" },
          { label: location.name }
        ]} />

        <div className="space-y-8 mt-8">
          <div>
            {location.logoUrl && (
              <img
                src={location.logoUrl}
                alt={`${location.name} logo`}
                className="h-16 w-auto object-contain mb-4"
                data-testid={`img-location-logo-${location.slug}`}
              />
            )}
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
              {hasMapError ? (
                <div className="w-full h-[400px] rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Координаты: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
                  </div>
                </div>
              ) : (
                <div 
                  ref={mapRef}
                  className="w-full h-[400px] rounded-lg grayscale"
                  data-testid="map-container"
                >
                  {isMapLoading && (
                    <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                      <div className="text-center text-muted-foreground">Загрузка карты...</div>
                    </div>
                  )}
                </div>
              )}
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
