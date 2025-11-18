import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Medal, Award, Timer, Activity } from "lucide-react";
import { SEO } from "@/components/SEO";

interface RatingEntry {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  profilePicture: string | null;
  totalDistance: number; // meters
  totalActivities: number;
  totalTime: number; // seconds
}

export default function Rating() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const queryParams = [
    selectedYear !== "all" ? `year=${selectedYear}` : null,
    selectedMonth !== "all" ? `month=${selectedMonth}` : null,
  ]
    .filter(Boolean)
    .join("&");

  const { data: ratings = [], isLoading } = useQuery<RatingEntry[]>({
    queryKey: ["/api/rating", queryParams],
  });

  const formatDistance = (meters: number): string => {
    const km = meters / 1000;
    return `${km.toFixed(1)} км`;
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}ч ${minutes}м`;
  };

  const formatPace = (meters: number, seconds: number): string => {
    if (meters === 0) return "-";
    const paceSecondsPerKm = (seconds / (meters / 1000));
    const paceMinutes = Math.floor(paceSecondsPerKm / 60);
    const paceSeconds = Math.floor(paceSecondsPerKm % 60);
    return `${paceMinutes}:${paceSeconds.toString().padStart(2, "0")} мин/км`;
  };

  const getMedalIcon = (position: number) => {
    if (position === 1) return <Trophy className="h-6 w-6 text-yellow-500" data-testid="icon-medal-1" />;
    if (position === 2) return <Medal className="h-6 w-6 text-gray-400" data-testid="icon-medal-2" />;
    if (position === 3) return <Award className="h-6 w-6 text-amber-700" data-testid="icon-medal-3" />;
    return null;
  };

  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  const months = [
    { value: "all", label: "Все месяцы" },
    { value: "1", label: "Январь" },
    { value: "2", label: "Февраль" },
    { value: "3", label: "Март" },
    { value: "4", label: "Апрель" },
    { value: "5", label: "Май" },
    { value: "6", label: "Июнь" },
    { value: "7", label: "Июль" },
    { value: "8", label: "Август" },
    { value: "9", label: "Сентябрь" },
    { value: "10", label: "Октябрь" },
    { value: "11", label: "Ноябрь" },
    { value: "12", label: "Декабрь" },
  ];

  return (
    <>
      <SEO
        title="Рейтинг бегунов | Mikkeller Running Club"
        description="Таблица лидеров Mikkeller Running Club Санкт-Петербург. Отслеживайте свои беговые достижения и сравнивайте результаты с другими участниками клуба."
        keywords="рейтинг бегунов, таблица лидеров, статистика бега, Mikkeller Running Club, беговой клуб Санкт-Петербург"
      />
      <div className="min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4" data-testid="heading-rating">
              Рейтинг бегунов
            </h1>
            <p className="text-lg text-muted-foreground">
              Отслеживайте свои достижения и сравнивайте результаты с другими участниками клуба
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Фильтры</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium mb-2 block">Год</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger data-testid="select-year">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium mb-2 block">Месяц</label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger data-testid="select-month">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <a href="/api/strava/auth">
                    <Button size="lg" data-testid="button-strava-login">
                      Войти через Strava
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Загрузка рейтинга...</p>
            </div>
          ) : ratings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground mb-4">
                  Пока нет данных за выбранный период
                </p>
                <a href="/api/strava/auth">
                  <Button data-testid="button-strava-login-empty">
                    Войти через Strava
                  </Button>
                </a>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ratings.map((entry, index) => {
                const position = index + 1;
                const fullName = [entry.firstName, entry.lastName]
                  .filter(Boolean)
                  .join(" ") || "Анонимный бегун";

                return (
                  <Card
                    key={entry.userId}
                    className={position <= 3 ? "border-primary" : ""}
                    data-testid={`card-rating-${position}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted font-bold text-lg">
                          {getMedalIcon(position) || position}
                        </div>

                        {entry.profilePicture && (
                          <img
                            src={entry.profilePicture}
                            alt={fullName}
                            className="w-12 h-12 rounded-full grayscale"
                            data-testid={`img-avatar-${position}`}
                          />
                        )}

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold" data-testid={`text-name-${position}`}>
                            {fullName}
                          </h3>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Activity className="h-4 w-4" />
                              <span data-testid={`text-distance-${position}`}>
                                {formatDistance(entry.totalDistance)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Timer className="h-4 w-4" />
                              <span data-testid={`text-time-${position}`}>
                                {formatTime(entry.totalTime)}
                              </span>
                            </div>
                            <div>
                              <span data-testid={`text-activities-${position}`}>
                                {entry.totalActivities} {entry.totalActivities === 1 ? "пробежка" : "пробежек"}
                              </span>
                            </div>
                            <div>
                              <span data-testid={`text-pace-${position}`}>
                                Средний темп: {formatPace(entry.totalDistance, entry.totalTime)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
