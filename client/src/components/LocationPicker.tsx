import { useEffect, useRef, useState } from 'react';

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

export function LocationPicker({ latitude, longitude, onLocationChange }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const placemarkRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadYandexMaps = () => {
      if (window.ymaps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY || '';
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(initMap);
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = new window.ymaps.Map(mapRef.current, {
        center: [latitude, longitude],
        zoom: 15,
        controls: ['zoomControl', 'searchControl'],
      }, {
        suppressMapOpenBlock: true,
      });

      mapInstanceRef.current = map;

      const placemark = new window.ymaps.Placemark([latitude, longitude], {
        hintContent: 'Перетащите маркер для выбора локации',
      }, {
        draggable: true,
        preset: 'islands#redDotIcon',
      });

      placemark.events.add('dragend', (e: any) => {
        const coords = e.get('target').geometry.getCoordinates();
        onLocationChange(coords[0], coords[1]);
      });

      map.geoObjects.add(placemark);
      placemarkRef.current = placemark;

      map.events.add('click', (e: any) => {
        const coords = e.get('coords');
        placemark.geometry.setCoordinates(coords);
        onLocationChange(coords[0], coords[1]);
      });

      setIsLoading(false);
    };

    loadYandexMaps();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (placemarkRef.current) {
      placemarkRef.current.geometry.setCoordinates([latitude, longitude]);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter([latitude, longitude], 15);
      }
    }
  }, [latitude, longitude]);

  return (
    <div className="relative h-[300px] w-full rounded-lg overflow-hidden border">
      {isLoading && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
          <div className="text-center text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-2"></div>
            <p className="text-sm">Загрузка карты...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      {!isLoading && (
        <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm p-2 rounded-md text-xs text-muted-foreground">
          Кликните по карте или перетащите маркер для выбора точки
        </div>
      )}
    </div>
  );
}
