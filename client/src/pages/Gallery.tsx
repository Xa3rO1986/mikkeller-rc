import { useState } from "react";
import PhotoCard from "@/components/PhotoCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import photo1 from '@assets/generated_images/Runners_celebrating_finish_969c4387.png';
import photo2 from '@assets/generated_images/Runner_stretching_morning_f3d2063d.png';
import photo3 from '@assets/generated_images/Runners_at_starting_line_dd1d8745.png';
import photo4 from '@assets/generated_images/Hero_runners_urban_setting_ad89a1fd.png';

export default function Gallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const photos = [
    { id: "1", url: photo1, title: "Финиш забега", eventTitle: "Riverside 10K" },
    { id: "2", url: photo2, title: "Разминка перед стартом", eventTitle: "Forest Trail 15K" },
    { id: "3", url: photo3, title: "На старте", eventTitle: "Urban Park 5K" },
    { id: "4", url: photo4, title: "Групповая пробежка", eventTitle: "Riverside 10K" },
    { id: "5", url: photo1, title: "Празднование", eventTitle: "Forest Trail 15K" },
    { id: "6", url: photo2, title: "Подготовка", eventTitle: "Urban Park 5K" },
  ];

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
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
              <SelectItem value="riverside">Riverside 10K</SelectItem>
              <SelectItem value="forest">Forest Trail 15K</SelectItem>
              <SelectItem value="urban">Urban Park 5K</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos.map((photo, index) => (
            <div key={photo.id} className="break-inside-avoid">
              <PhotoCard
                {...photo}
                onClick={() => openLightbox(index)}
              />
            </div>
          ))}
        </div>

        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0">
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

              <img
                src={photos[currentPhotoIndex].url}
                alt={photos[currentPhotoIndex].title}
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
                <p className="text-lg font-medium">{photos[currentPhotoIndex].title}</p>
                <p className="text-sm text-white/70">{photos[currentPhotoIndex].eventTitle}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
