import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Calendar, MapPin, TrendingUp, ArrowRight, X, ChevronLeft, ChevronRight, Route } from "lucide-react";
import { Link } from "wouter";
import EventCard from "@/components/EventCard";
import PhotoCard from "@/components/PhotoCard";
import NewsCard from "@/components/NewsCard";
import { useQuery } from "@tanstack/react-query";
import type { Event, Photo, Location, EventRoute, News } from "@shared/schema";
import { formatRussianDate, formatRussianMonth } from "@/lib/date-utils";
import { SEO } from "@/components/SEO";
import { seoPages } from "@/config/seo";

import heroImage from '@assets/generated_images/Hero_runners_urban_setting_ad89a1fd.png';
import logo from '@assets/MRC_1763044539473.png';

interface EventWithRoutes extends Event {
  routes?: EventRoute[];
}

export default function Home() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const { data: upcomingEvents = [], isLoading: eventsLoading } = useQuery<EventWithRoutes[]>({
    queryKey: ['/api/events?upcoming=true'],
  });

  const { data: photos = [], isLoading: photosLoading } = useQuery<Photo[]>({
    queryKey: ['/api/photos?status=approved'],
  });

  const { data: news = [], isLoading: newsLoading } = useQuery<News[]>({
    queryKey: ['/api/news?status=published&limit=3'],
  });

  const nextEvent = upcomingEvents[0];
  
  const { data: nextEventLocation } = useQuery<Location>({
    queryKey: ["/api/locations", nextEvent?.locationId],
    enabled: !!nextEvent?.locationId,
  });

  const { data: homeSettings } = useQuery<{
    heroImageUrl: string | null;
    heroTitle: string;
    heroSubtitle: string;
    aboutTitle: string;
    aboutText1: string;
    aboutText2: string;
    statsParticipants: string;
    statsCities: string;
    statsRuns: string;
    statsKilometers: string;
  }>({
    queryKey: ['/api/home-settings'],
    staleTime: 0,
    refetchOnMount: true,
  });

  const nextEventLocationText = nextEventLocation?.name || nextEvent?.address || 'Место уточняется';
  
  const routes = nextEvent?.routes || [];
  const hasGpx = routes.some(route => route.gpxUrl);
  const distanceText = routes.length > 0 
    ? routes.map(r => `${r.distanceKm} км`).join(' и ')
    : nextEvent?.distanceKm 
      ? `${nextEvent.distanceKm} км` 
      : null;

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const nextPhoto = () => {
    const displayedPhotos = photos.slice(0, 3);
    setCurrentPhotoIndex((prev) => (prev + 1) % displayedPhotos.length);
  };

  const prevPhoto = () => {
    const displayedPhotos = photos.slice(0, 3);
    setCurrentPhotoIndex((prev) => (prev - 1 + displayedPhotos.length) % displayedPhotos.length);
  };
  
  return (
    <>
      <SEO {...seoPages.home} ogImage={homeSettings?.heroImageUrl || seoPages.home.ogImage} />
      <div className="min-h-screen">
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={homeSettings?.heroImageUrl || heroImage}
            alt="Mikkeller Running Club"
            className="w-full h-full object-cover grayscale"
            onError={(e) => {
              e.currentTarget.src = heroImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        </div>

        <div className="relative z-10 text-center px-4 text-white max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src={logo} 
              alt="Mikkeller Running Club Logo" 
              className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-white p-2 grayscale"
            />
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            {homeSettings?.heroTitle || "Mikkeller Running Club"}
          </h1>
          <p className="text-xl lg:text-2xl mb-8 font-medium">
            {homeSettings?.heroSubtitle || "Мы бегаем. Мы пьём пиво. Мы друзья."}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/events">
              <Button
                size="lg"
                className="text-lg px-8"
                data-testid="button-events-hero"
              >
                Смотреть забеги
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold">Ближайший забег</h2>
            <Link href="/events">
              <Button variant="ghost" data-testid="button-all-events">
                Все забеги
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {eventsLoading ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Загрузка событий...</p>
            </div>
          ) : nextEvent ? (
            <Card className="overflow-hidden border-2 border-black">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto bg-muted flex items-center justify-center grayscale hover:grayscale-0 transition-all">
                  {nextEvent.coverImageUrl ? (
                    <img
                      src={nextEvent.coverImageUrl}
                      alt={nextEvent.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">Изображение скоро появится</p>
                    </div>
                  )}
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="mb-4">
                    <div className="inline-block bg-white text-black border border-black px-4 py-2 rounded-md font-bold text-sm mb-4">
                      {new Date(nextEvent.startsAt).getDate()} {formatRussianMonth(nextEvent.startsAt, true)} {new Date(nextEvent.startsAt).getFullYear()}
                    </div>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                    {nextEvent.title}
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5" />
                      <span>{formatRussianDate(nextEvent.startsAt, { includeYear: true, includeTime: true })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5" />
                      <span>{nextEventLocationText}</span>
                    </div>
                    {distanceText && (
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5" />
                        <span data-testid="text-next-event-distance">{distanceText}</span>
                      </div>
                    )}
                    {(hasGpx || nextEvent.gpxUrl) && (
                      <div className="flex items-center gap-3">
                        <Route className="h-5 w-5" />
                        <span data-testid="text-next-event-gpx">GPX маршрут доступен</span>
                      </div>
                    )}
                  </div>
                  <Link href={`/events/${nextEvent.slug}`}>
                    <Button size="lg" className="w-full md:w-auto" data-testid="button-upcoming-event">
                      Подробнее
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Предстоящие забеги скоро появятся</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold">Новости</h2>
            <Link href="/news">
              <Button variant="ghost" data-testid="button-all-news">
                Все новости
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {newsLoading ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Загрузка новостей...</p>
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((newsItem) => (
                <NewsCard key={newsItem.id} news={newsItem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Новости скоро появятся</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold">Фотогалерея</h2>
            <Link href="/gallery">
              <Button variant="ghost" data-testid="button-all-photos">
                Смотреть всё
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {photosLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Загрузка фотографий...</p>
            </div>
          ) : photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {photos.slice(0, 3).map((photo, index) => (
                <PhotoCard
                  key={photo.id}
                  id={photo.id}
                  url={photo.url}
                  title={photo.title || 'Фото забега'}
                  eventTitle={photo.eventId ? 'Забег' : undefined}
                  onClick={() => openLightbox(index)}
                  grayscale={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Фотографии скоро появятся</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                {homeSettings?.aboutTitle || "О клубе"}
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                {homeSettings?.aboutText1 || "Mikkeller Running Club — это международное сообщество бегунов, которые встречаются каждую неделю, чтобы вместе бегать и наслаждаться компанией друг друга."}
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                {homeSettings?.aboutText2 || "Мы бегаем в более чем 50 городах по всему миру. Наши забеги подходят для всех уровней подготовки — от новичков до опытных марафонцев."}
              </p>
              <Link href="/about">
                <Button size="lg" data-testid="button-about">
                  Узнать больше
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {homeSettings?.statsParticipants || "1200+"}
                  </div>
                  <div className="text-sm text-muted-foreground">Участников</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {homeSettings?.statsCities || "8К"}
                  </div>
                  <div className="text-sm text-muted-foreground">Литров пива</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {homeSettings?.statsRuns || "500+"}
                  </div>
                  <div className="text-sm text-muted-foreground">Забегов</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {homeSettings?.statsKilometers || "15K"}
                  </div>
                  <div className="text-sm text-muted-foreground">Километров</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">Предстоящие забеги</h2>
          {eventsLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Загрузка забегов...</p>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} grayscale={true} showEventType={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Предстоящие забеги скоро появятся</p>
            </div>
          )}
        </div>
      </section>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0">
          <VisuallyHidden>
            <DialogTitle>Просмотр фотографии</DialogTitle>
            <DialogDescription>Увеличенное изображение фотографии</DialogDescription>
          </VisuallyHidden>
          <div className="relative w-full h-[95vh] flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/10"
              onClick={() => setLightboxOpen(false)}
              data-testid="button-close-lightbox"
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10"
              onClick={prevPhoto}
              data-testid="button-prev-photo"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            {photos.slice(0, 3)[currentPhotoIndex] && (
              <>
                <img
                  src={photos.slice(0, 3)[currentPhotoIndex].url}
                  alt={photos.slice(0, 3)[currentPhotoIndex].title || 'Фото'}
                  className="max-w-full max-h-full object-contain"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10"
                  onClick={nextPhoto}
                  data-testid="button-next-photo"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>

                <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                  <p className="text-lg font-medium">{photos.slice(0, 3)[currentPhotoIndex].title || 'Без названия'}</p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
}
