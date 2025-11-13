import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, TrendingUp, Download, Share2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Event, Photo, Location, EventRoute } from "@shared/schema";
import { formatRussianDate } from "@/lib/date-utils";
import { formatEventType } from "@shared/constants/eventTypes";
import { DisqusComments } from "@/components/DisqusComments";
import { GPXMap } from "@/components/GPXMap";
import NotFound from "@/pages/not-found";

export default function EventDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: event, isLoading: eventLoading, error: eventError } = useQuery<Event>({
    queryKey: ['/api/events', slug],
    enabled: !!slug,
    staleTime: 0, // Always refetch on mount
    refetchOnMount: true,
  });

  const { data: photos = [] } = useQuery<Photo[]>({
    queryKey: [`/api/photos?eventId=${event?.id}`],
    enabled: !!event?.id,
  });

  const { data: location } = useQuery<Location>({
    queryKey: ['/api/locations', event?.locationId],
    enabled: !!event?.locationId,
  });

  const { data: routes = [] } = useQuery<EventRoute[]>({
    queryKey: ['/api/events', event?.id, 'routes'],
    enabled: !!event?.id,
  });

  const sortedRoutes = [...routes].sort((a, b) => a.distanceKm - b.distanceKm);

  const addToCalendar = () => {
    if (!event) return;

    const eventDate = new Date(event.startsAt);
    const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000); // +2 hours

    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Mikkeller Running Club//Event//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@mikkellerrunningclub.com`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(eventDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:${event.title}`,
      event.description ? `DESCRIPTION:${event.description.replace(/<[^>]*>/g, '').replace(/\n/g, '\\n')}` : '',
      event.address ? `LOCATION:${event.address}` : '',
      `URL:${window.location.href}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.slug || 'event'}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  if (!slug || eventError) {
    return <NotFound />;
  }

  if (eventLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка события...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return <NotFound />;
  }

  const eventDate = new Date(event.startsAt);
  const approvedPhotos = photos.filter(p => p.status === 'approved');
  
  return (
    <div className="min-h-screen">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Breadcrumbs items={[
            { label: "Забеги", href: "/events" },
            { label: event.title }
          ]} />
          
          <div className="relative h-[400px] overflow-hidden rounded-lg mt-4">
            {event.coverImageUrl ? (
              <img
                src={event.coverImageUrl}
                alt={event.title}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Calendar className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Link href="/events">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Все события
                  </Button>
                </Link>
                {event.eventType && (
                  <Badge variant="outline" className="bg-black/50 text-white border-white/30">
                    {formatEventType(event.eventType)}
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4" data-testid="text-event-title">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{formatRussianDate(eventDate, { includeYear: true })} в {eventDate.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {event.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{event.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {event.description && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Описание</h2>
                  <div 
                    className="prose prose-lg max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                    data-testid="text-event-description"
                  />
                </section>
              )}

              {sortedRoutes.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">
                    {sortedRoutes.length > 1 ? 'Маршруты' : 'Маршрут'}
                  </h2>
                  <div className="space-y-6">
                    {sortedRoutes.map((route) => (
                      <Card key={route.id} data-testid={`card-route-${route.id}`}>
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div>
                              <h3 className="text-lg font-semibold" data-testid={`text-route-name-${route.id}`}>
                                {route.name || `Маршрут ${route.distanceKm} км`}
                              </h3>
                              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <TrendingUp className="h-4 w-4" />
                                <span data-testid={`text-route-distance-${route.id}`}>{route.distanceKm} км</span>
                              </div>
                            </div>
                            {route.gpxUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                data-testid={`button-download-gpx-${route.id}`}
                                onClick={() => window.open(route.gpxUrl!, '_blank')}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Скачать GPX
                              </Button>
                            )}
                          </div>
                          {route.gpxUrl && (
                            <div data-testid={`map-route-${route.id}`}>
                              <GPXMap gpxUrl={route.gpxUrl} />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {approvedPhotos.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Фотогалерея</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {approvedPhotos.map((photo) => (
                      <div key={photo.id} className="aspect-square overflow-hidden rounded-lg">
                        <img
                          src={photo.url}
                          alt={photo.title || 'Фото события'}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                          data-testid={`img-photo-${photo.id}`}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-2xl font-bold mb-4">Комментарии</h2>
                <DisqusComments
                  shortname={import.meta.env.VITE_DISQUS_SHORTNAME || 'mikkeller-club'}
                  identifier={`event-${slug}`}
                  title={event.title}
                  url={window.location.href}
                />
              </section>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    data-testid="button-add-calendar"
                    onClick={addToCalendar}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Добавить в календарь
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    data-testid="button-share"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: event.title,
                          url: window.location.href,
                        });
                      }
                    }}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Поделиться
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Детали</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Дата и время</div>
                      <div className="font-medium">
                        {formatRussianDate(eventDate, { includeYear: true })} в {eventDate.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {event.address && (
                      <div>
                        <div className="text-muted-foreground mb-1">Место встречи</div>
                        <div className="font-medium">{event.address}</div>
                      </div>
                    )}
                    {sortedRoutes.length > 0 && (
                      <div>
                        <div className="text-muted-foreground mb-1">Дистанции</div>
                        <div className="font-medium space-y-1" data-testid="text-event-distances">
                          {sortedRoutes.map((route, index) => (
                            <div key={route.id}>
                              {route.name || `${route.distanceKm} км`}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {event.eventType && (
                      <div>
                        <div className="text-muted-foreground mb-1">Тип забега</div>
                        <Badge variant="secondary">{formatEventType(event.eventType)}</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {location && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Локация</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          {location.logoUrl && (
                            <img
                              src={location.logoUrl}
                              alt={`${location.name} logo`}
                              className="h-20 w-auto max-w-full object-contain mb-2"
                              data-testid={`img-location-logo-${location.slug}`}
                            />
                          )}
                          <Link href={`/locations/${location.slug}`}>
                            <div className="font-medium hover:underline cursor-pointer" data-testid="link-location-name">
                              {location.name}
                            </div>
                          </Link>
                          <div className="text-sm text-muted-foreground" data-testid="text-location-address">
                            {location.address}
                          </div>
                        </div>
                      </div>
                      {location.description && (
                        <p className="text-sm text-muted-foreground pl-7">
                          {location.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {event.tags.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Теги</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
