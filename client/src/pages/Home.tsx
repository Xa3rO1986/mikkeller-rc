import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import EventCard from "@/components/EventCard";
import PhotoCard from "@/components/PhotoCard";
import { useQuery } from "@tanstack/react-query";
import type { Event, Photo } from "@shared/schema";
import { formatRussianDate, formatRussianMonth } from "@/lib/date-utils";

import heroImage from '@assets/generated_images/Hero_runners_urban_setting_ad89a1fd.png';

export default function Home() {
  const { data: upcomingEvents = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ['/api/events?upcoming=true'],
  });

  const { data: photos = [], isLoading: photosLoading } = useQuery<Photo[]>({
    queryKey: ['/api/photos'],
  });

  const nextEvent = upcomingEvents[0];
  
  return (
    <div className="min-h-screen">
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Mikkeller Running Club"
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        </div>

        <div className="relative z-10 text-center px-4 text-white max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Mikkeller Running Club
          </h1>
          <p className="text-xl lg:text-2xl mb-8 font-medium">
            Мы бегаем. Мы пьём пиво. Мы друзья.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/join">
              <Button size="lg" className="text-lg px-8" data-testid="button-join-hero">
                Присоединиться
              </Button>
            </Link>
            <Link href="/events">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 backdrop-blur-md bg-white/10 hover:bg-white/20 border-white/30 text-white"
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
                <div className="relative h-64 md:h-auto bg-muted flex items-center justify-center">
                  {nextEvent.coverImageUrl ? (
                    <img
                      src={nextEvent.coverImageUrl}
                      alt={nextEvent.title}
                      className="w-full h-full object-cover grayscale"
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
                    <div className="inline-block bg-black text-white px-4 py-2 rounded-md font-bold text-sm mb-4">
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
                      <span>{nextEvent.address}</span>
                    </div>
                    {(nextEvent.distanceKm || nextEvent.elevationGain) && (
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5" />
                        <span>
                          {nextEvent.distanceKm && `${nextEvent.distanceKm} км`}
                          {nextEvent.distanceKm && nextEvent.elevationGain && ' • '}
                          {nextEvent.elevationGain && `${nextEvent.elevationGain}м набор высоты`}
                        </span>
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
              {photos.slice(0, 3).map((photo) => (
                <PhotoCard
                  key={photo.id}
                  id={photo.id}
                  url={photo.url}
                  title={photo.title || 'Фото забега'}
                  eventTitle={photo.eventId ? 'Забег' : undefined}
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

      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">О клубе</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Mikkeller Running Club — это международное сообщество бегунов, которые встречаются каждую неделю, чтобы вместе бегать и наслаждаться компанией друг друга.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Мы бегаем в более чем 50 городах по всему миру. Наши забеги подходят для всех уровней подготовки — от новичков до опытных марафонцев.
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
                  <div className="text-4xl font-bold text-primary mb-2">1200+</div>
                  <div className="text-sm text-muted-foreground">Участников</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">Городов</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Забегов</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">15K</div>
                  <div className="text-sm text-muted-foreground">Километров</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">Предстоящие забеги</h2>
          {eventsLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Загрузка забегов...</p>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Предстоящие забеги скоро появятся</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
