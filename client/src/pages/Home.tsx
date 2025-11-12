import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import EventCard from "@/components/EventCard";
import PhotoCard from "@/components/PhotoCard";

import heroImage from '@assets/generated_images/Hero_runners_urban_setting_ad89a1fd.png';
import event1 from '@assets/generated_images/Riverside_10k_route_cover_17dba083.png';
import event2 from '@assets/generated_images/Forest_trail_15k_cover_f2cdae95.png';
import event3 from '@assets/generated_images/Urban_park_5k_cover_f65fbe07.png';
import photo1 from '@assets/generated_images/Runners_celebrating_finish_969c4387.png';
import photo2 from '@assets/generated_images/Runner_stretching_morning_f3d2063d.png';
import photo3 from '@assets/generated_images/Runners_at_starting_line_dd1d8745.png';

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Mikkeller Running Club"
            className="w-full h-full object-cover"
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

          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto">
                <img
                  src={event1}
                  alt="Riverside 10K"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <div className="mb-4">
                  <div className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-sm mb-4">
                    20 ДЕК
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                  Забег вдоль набережной
                </h3>
                <div className="space-y-3 mb-6 text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    <span>Пятница, 20 декабря 2024, 10:00</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5" />
                    <span>Набережная, Москва</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5" />
                    <span>10 км • 50м набор высоты</span>
                  </div>
                </div>
                <Link href="/events/riverside-10k">
                  <Button size="lg" className="w-full md:w-auto" data-testid="button-upcoming-event">
                    Подробнее и регистрация
                  </Button>
                </Link>
              </CardContent>
            </div>
          </Card>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PhotoCard
              id="1"
              url={photo1}
              title="Финиш забега"
              eventTitle="Riverside 10K"
            />
            <PhotoCard
              id="2"
              url={photo2}
              title="Разминка"
              eventTitle="Forest Trail 15K"
            />
            <PhotoCard
              id="3"
              url={photo3}
              title="Старт"
              eventTitle="Urban Park 5K"
            />
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EventCard
              slug="riverside-10k"
              title="Забег вдоль набережной"
              date="2024-12-20T10:00:00"
              location="Набережная, Москва"
              distance={10}
              elevation={50}
              coverImage={event1}
              status="open"
              tags={["10км", "городской", "набережная"]}
            />
            <EventCard
              slug="forest-trail-15k"
              title="Лесной трейл"
              date="2024-12-27T09:00:00"
              location="Лесопарк, Москва"
              distance={15}
              elevation={280}
              coverImage={event2}
              status="upcoming"
              tags={["15км", "трейл", "природа"]}
            />
            <EventCard
              slug="urban-park-5k"
              title="Пробежка в парке"
              date="2025-01-10T10:00:00"
              location="Парк Горького, Москва"
              distance={5}
              coverImage={event3}
              status="upcoming"
              tags={["5км", "парк", "легко"]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
