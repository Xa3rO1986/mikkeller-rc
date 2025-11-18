import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import type { News } from "@shared/schema";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/news/${news.slug}`}>
      <Card className="overflow-hidden hover-elevate active-elevate-2 h-full flex flex-col" data-testid={`card-news-${news.id}`}>
        {news.coverImageUrl && (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={news.coverImageUrl}
              alt={news.title}
              className="w-full h-full object-cover grayscale"
              loading="lazy"
            />
          </div>
        )}
        <CardContent className="p-6 flex-1 flex flex-col">
          {news.publishedAt && (
            <time className="text-sm text-muted-foreground mb-2" data-testid="text-published-date">
              {format(new Date(news.publishedAt), "d MMMM yyyy", { locale: ru })}
            </time>
          )}
          <h3 className="text-xl font-bold mb-2" data-testid="text-title">
            {news.title}
          </h3>
          {news.excerpt && (
            <p className="text-muted-foreground line-clamp-3 flex-1" data-testid="text-excerpt">
              {news.excerpt}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
