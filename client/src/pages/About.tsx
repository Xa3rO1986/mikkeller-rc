import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MapPin, Users, Calendar, Globe } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { AboutSettings } from "@shared/schema";

import heroImage from '@assets/generated_images/Runners_celebrating_finish_969c4387.png';

export default function About() {
  const { data: settings } = useQuery<AboutSettings>({
    queryKey: ['/api/about-settings'],
  });

  return (
    <div className="min-h-screen">
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Breadcrumbs items={[{ label: "О клубе" }]} />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                {settings?.heroTitle || "О Mikkeller Running Club"}
              </h1>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  {settings?.heroText1 || "Mikkeller Running Club — это международное беговое сообщество, основанное в 2014 году в Копенгагене. Наша философия проста: бег должен быть доступен всем, независимо от уровня подготовки."}
                </p>
                <p>
                  {settings?.heroText2 || "Каждую неделю тысячи бегунов по всему миру выходят на улицы своих городов, чтобы пробежать вместе 5-10 километров. После забега мы собираемся вместе, чтобы отметить достижения и насладиться компанией друг друга."}
                </p>
                <p>
                  {settings?.heroText3 || "В Москве клуб работает с 2016 года и объединяет более 1200 активных участников. Мы проводим еженедельные забеги в разных локациях города."}
                </p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border-2 border-black">
              <img
                src={heroImage}
                alt="MRC Community"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">
            Mikkeller Running Club в цифрах
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                <div className="text-4xl font-bold mb-2">{settings?.statsMembers || "1,200+"}</div>
                <div className="text-sm text-muted-foreground">{settings?.statsMembersLabel || "Участников в Москве"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <Globe className="h-12 w-12 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">{settings?.statsBars || "25+"}</div>
                <div className="text-sm text-muted-foreground">{settings?.statsBarsLabel || "Баров-партнеров"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
                <div className="text-4xl font-bold mb-2">{settings?.statsRuns || "500+"}</div>
                <div className="text-sm text-muted-foreground">{settings?.statsRunsLabel || "Проведено забегов"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
                <div className="text-4xl font-bold mb-2">{settings?.statsDistance || "15,000"}</div>
                <div className="text-sm text-muted-foreground">{settings?.statsDistanceLabel || "Километров пробежано"}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">Как присоединиться</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2">Зарегистрируйтесь</h3>
                <p className="text-sm text-muted-foreground">
                  Заполните простую форму регистрации на нашем сайте. Это бесплатно!
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="font-semibold text-lg mb-2">Выберите забег</h3>
                <p className="text-sm text-muted-foreground">
                  Посмотрите расписание предстоящих забегов и выберите удобное время и бар.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="font-semibold text-lg mb-2">Приходите и бегите</h3>
                <p className="text-sm text-muted-foreground">
                  Приходите в указанное время, знакомьтесь с участниками и наслаждайтесь пробежкой!
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/join">
              <Button size="lg" className="text-lg px-8" data-testid="button-join-now">
                Присоединиться сейчас
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">Правила клуба</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">{settings?.rule1Title || "Все уровни приветствуются"}</h3>
                <p className="text-sm text-muted-foreground">
                  {settings?.rule1Text || "Не важно, новичок вы или опытный бегун — каждый найдёт свой темп и группу единомышленников."}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">{settings?.rule2Title || "Никто не остаётся позади"}</h3>
                <p className="text-sm text-muted-foreground">
                  {settings?.rule2Text || "Мы всегда бежим вместе. У нас есть группы разного темпа, чтобы всем было комфортно."}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">{settings?.rule3Title || "Безопасность превыше всего"}</h3>
                <p className="text-sm text-muted-foreground">
                  {settings?.rule3Text || "Следуйте правилам дорожного движения, бегайте по правой стороне дороги, используйте светоотражающие элементы."}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">{settings?.rule4Title || "Уважение к другим"}</h3>
                <p className="text-sm text-muted-foreground">
                  {settings?.rule4Text || "Мы уважаем всех участников, пешеходов и других пользователей дорог. Будьте вежливы и дружелюбны."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
