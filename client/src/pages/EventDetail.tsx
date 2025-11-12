import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, TrendingUp, Download, Share2, Users } from "lucide-react";
import PhotoCard from "@/components/PhotoCard";

import coverImage from '@assets/generated_images/Riverside_10k_route_cover_17dba083.png';
import photo1 from '@assets/generated_images/Runners_celebrating_finish_969c4387.png';
import photo2 from '@assets/generated_images/Runner_stretching_morning_f3d2063d.png';

export default function EventDetail() {
  return (
    <div className="min-h-screen">
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={coverImage}
          alt="Riverside 10K"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <Badge className="bg-primary text-primary-foreground mb-4">
              Регистрация открыта
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Забег вдоль набережной
            </h1>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Пятница, 20 декабря 2024, 10:00</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Набережная, Москва</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>10 км • 50м набор</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>45 участников</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">Описание</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p>
                    Присоединяйтесь к нам на живописный забег вдоль набережной! Это идеальный маршрут для бегунов всех уровней подготовки.
                  </p>
                  <p>
                    Маршрут проходит по красивой набережной с видом на реку и городской пейзаж. Покрытие — асфальт, есть несколько плавных подъёмов.
                  </p>
                  <p>
                    После забега — традиционные напитки и общение в баре неподалёку!
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Маршрут</h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-2" />
                        <p>Карта маршрута</p>
                        <p className="text-sm">Leaflet + GPX интеграция</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">10.0</div>
                      <div className="text-sm text-muted-foreground">км</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">50</div>
                      <div className="text-sm text-muted-foreground">м набор</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">5:30</div>
                      <div className="text-sm text-muted-foreground">мин/км</div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Фотогалерея</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <PhotoCard id="1" url={photo1} title="Финиш" />
                  <PhotoCard id="2" url={photo2} title="Разминка" />
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <p className="text-sm">Загрузить фото</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Комментарии</h2>
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <p>Система комментариев Disqus</p>
                    <p className="text-sm mt-2">Интеграция будет добавлена</p>
                  </CardContent>
                </Card>
              </section>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Button className="w-full" size="lg" data-testid="button-register">
                    Зарегистрироваться
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-add-calendar">
                    <Calendar className="mr-2 h-4 w-4" />
                    Добавить в календарь
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-download-gpx">
                    <Download className="mr-2 h-4 w-4" />
                    Скачать GPX
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-share">
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
                      <div className="font-medium">20 декабря 2024, 10:00</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Место старта</div>
                      <div className="font-medium">Набережная, у моста</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Дистанция</div>
                      <div className="font-medium">10 км</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Сложность</div>
                      <Badge variant="secondary">Средняя</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Организатор</h3>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      MRC
                    </div>
                    <div>
                      <div className="font-medium">Mikkeller Running Club</div>
                      <div className="text-sm text-muted-foreground">Москва</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
