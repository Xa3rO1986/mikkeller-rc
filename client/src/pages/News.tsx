import { useQuery } from "@tanstack/react-query";
import type { News } from "@shared/schema";
import NewsCard from "@/components/NewsCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SEO } from "@/components/SEO";
import { usePageSEO } from "@/config/seo";

export default function News() {
  const seoSettings = usePageSEO('news');
  
  const { data: news = [], isLoading } = useQuery<News[]>({
    queryKey: ['/api/news?status=published'],
  });

  return (
    <>
      <SEO {...seoSettings} />
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Breadcrumbs items={[{ label: "Новости" }]} />
        
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4" data-testid="heading-news">
              Новости
            </h1>
            <p className="text-lg text-muted-foreground">
              Последние новости и события клуба
            </p>
          </div>

          {isLoading ? (
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
              <p className="text-lg text-muted-foreground">
                Новостей пока нет
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
