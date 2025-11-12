import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, TrendingUp } from "lucide-react";
import { Link } from "wouter";

interface EventCardProps {
  slug: string;
  title: string;
  date: string;
  location: string;
  distance: number;
  elevation?: number;
  coverImage: string;
  status: "open" | "closed" | "upcoming";
  tags: string[];
}

export default function EventCard({
  slug,
  title,
  date,
  location,
  distance,
  elevation,
  coverImage,
  status,
  tags,
}: EventCardProps) {
  const statusColors = {
    open: "bg-primary text-primary-foreground",
    closed: "bg-muted text-muted-foreground",
    upcoming: "bg-accent text-accent-foreground",
  };

  const statusLabels = {
    open: "Регистрация открыта",
    closed: "Регистрация закрыта",
    upcoming: "Скоро",
  };

  return (
    <Card className="overflow-hidden hover:-translate-y-1 transition-transform" data-testid={`card-event-${slug}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge className={statusColors[status]}>
            {statusLabels[status]}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full w-16 h-16 flex flex-col items-center justify-center font-bold">
          <span className="text-2xl">{new Date(date).getDate()}</span>
          <span className="text-xs">{new Date(date).toLocaleDateString('ru', { month: 'short' })}</span>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="font-bold text-xl mb-3">{title}</h3>

        <div className="space-y-2 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(date).toLocaleDateString('ru', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>{distance} км{elevation ? ` • ${elevation}м набор` : ''}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <Link href={`/events/${slug}`}>
          <Button className="w-full" data-testid={`button-event-${slug}`}>
            Подробнее
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
