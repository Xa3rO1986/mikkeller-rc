import { useState, useMemo } from "react";
import PhotoCard from "@/components/PhotoCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Photo, Event } from "@shared/schema";
import { SEO } from "@/components/SEO";
import { seoPages } from "@/config/seo";

export default function Gallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const { data: allPhotos = [], isLoading: photosLoading } = useQuery<Photo[]>({
    queryKey: ['/api/photos?status=approved'],
  });

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const eventsMap = useMemo(() => {
    return new Map(events.map(e => [e.id, e]));
  }, [events]);

  const filteredPhotos = useMemo(() => {
    return allPhotos.filter(photo => {
      const matchesEvent = eventFilter === "all" || photo.eventId === eventFilter;
      const matchesSearch = !searchQuery || 
        photo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesEvent && matchesSearch;
    });
  }, [allPhotos, eventFilter, searchQuery]);

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  const getEventTitle = (eventId: string | null) => {
    if (!eventId) return 'Без события';
    const event = eventsMap.get(eventId);
    return event?.title || 'Событие не найдено';
  };

  return (
    <>
      <SEO {...seoPages.gallery} />
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Breadcrumbs items={[{ label: "Галерея" }]} />
        
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Галерея</h1>
          <p className="text-lg text-muted-foreground">
            Фотографии с наших забегов
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          <Input
            placeholder="Поиск фотографий..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
            data-testid="input-search-photos"
          />

          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-[200px]" data-testid="select-event-filter">
              <SelectValue placeholder="Выбрать событие" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все события</SelectItem>
              {events.map(event => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {photosLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Загрузка фотографий...</p>
          </div>
        ) : filteredPhotos.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredPhotos.map((photo, index) => (
              <div key={photo.id} className="break-inside-avoid">
                <PhotoCard
                  id={photo.id}
                  url={photo.url}
                  title={photo.title || ''}
                  eventTitle={getEventTitle(photo.eventId)}
                  onClick={() => openLightbox(index)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {searchQuery || eventFilter !== "all" 
                ? "Фотографий не найдено" 
                : "Фотографии скоро появятся"}
            </p>
          </div>
        )}

        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0">
            <VisuallyHidden>
              <DialogTitle>Просмотр фотографии</DialogTitle>
              <DialogDescription>Увеличенное изображение фотографии</DialogDescription>
            </VisuallyHidden>
            <div className="relative w-full h-[95vh] flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/10"
                onClick={() => setLightboxOpen(false)}
                data-testid="button-close-lightbox"
              >
                <X className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10"
                onClick={prevPhoto}
                data-testid="button-prev-photo"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              {filteredPhotos[currentPhotoIndex] && (
                <>
                  <img
                    src={filteredPhotos[currentPhotoIndex].url}
                    alt={filteredPhotos[currentPhotoIndex].title || 'Фото'}
                    className="max-w-full max-h-full object-contain"
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10"
                    onClick={nextPhoto}
                    data-testid="button-next-photo"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>

                  <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                    <p className="text-lg font-medium">{filteredPhotos[currentPhotoIndex].title || 'Без названия'}</p>
                    <p className="text-sm text-white/70">{getEventTitle(filteredPhotos[currentPhotoIndex].eventId)}</p>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </>
  );
}
