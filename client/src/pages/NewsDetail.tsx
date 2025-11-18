import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { Link } from "wouter";
import type { News } from "@shared/schema";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import NotFound from "@/pages/not-found";
import { SEO } from "@/components/SEO";
import { getNewsSEO } from "@/config/seo";

export default function NewsDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: news, isLoading, error } = useQuery<News>({
    queryKey: [`/api/news/${slug}`],
    enabled: !!slug,
    staleTime: 0,
    refetchOnMount: true,
  });

  const handleShare = async () => {
    if (!news) return;

    const shareData = {
      title: news.title,
      text: news.excerpt || news.title,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена');
    }
  };

  if (!slug || error) {
    return <NotFound />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка новости...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return <NotFound />;
  }

  const seo = getNewsSEO(
    news.title,
    news.excerpt || '',
    news.content,
    news.coverImageUrl || undefined,
    news.slug
  );

  return (
    <>
      <SEO {...seo} />
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Новости", href: "/news" },
              { label: news.title }
            ]}
          />

          <Link href="/news">
            <Button variant="ghost" className="mb-8" data-testid="button-back-news">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к новостям
            </Button>
          </Link>

          {news.coverImageUrl && (
            <div className="aspect-[16/9] overflow-hidden rounded-md mb-8">
              <img
                src={news.coverImageUrl}
                alt={news.title}
                className="w-full h-full object-cover grayscale"
                data-testid="img-cover"
              />
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              {news.publishedAt && (
                <div className="flex items-center" data-testid="text-published-date">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(news.publishedAt), "d MMMM yyyy", { locale: ru })}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                data-testid="button-share"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Поделиться
              </Button>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-4" data-testid="heading-title">
              {news.title}
            </h1>

            {news.excerpt && (
              <p className="text-xl text-muted-foreground mb-6" data-testid="text-excerpt">
                {news.excerpt}
              </p>
            )}
          </div>

          <div
            className="prose prose-lg max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: news.content }}
            data-testid="content-body"
          />
        </div>
      </div>
    </>
  );
}
