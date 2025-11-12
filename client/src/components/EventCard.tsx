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
  const eventDate = new Date(date);
  
  return (
    <Card className="overflow-hidden hover:-translate-y-1 transition-transform border-2 border-black" data-testid={`card-event-${slug}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover grayscale"
        />
        <div className="absolute top-4 right-4 bg-black text-white rounded-md px-4 py-2 flex flex-col items-center justify-center font-bold">
          <span className="text-2xl">{eventDate.getDate()}</span>
          <span className="text-xs">{eventDate.toLocaleDateString('ru', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="font-bold text-xl mb-3">{title}</h3>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{eventDate.toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
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
