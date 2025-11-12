import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadYandexMaps = () => {
      if (window.ymaps) {
        initMap();
        return;
      }

      const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;
      
      if (!apiKey) {
        setHasError(true);
        setErrorMessage('API ключ Yandex Maps не настроен. Используйте ручной ввод координат.');
        setIsLoading(false);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      
      script.onload = () => {
        try {
          window.ymaps.ready(() => {
            try {
              initMap();
            } catch (error) {
              handleMapError(error);
            }
          });
        } catch (error) {
          handleMapError(error);
        }
      };

      script.onerror = () => {
        setHasError(true);
        setErrorMessage('Не удалось загрузить Yandex Maps. Используйте ручной ввод координат.');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    const handleMapError = (error: any) => {
      console.error('Yandex Maps error:', error);
      setHasError(true);
      setErrorMessage('Ошибка инициализации карты. Используйте ручной ввод координат.');
      setIsLoading(false);
    };

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      try {
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
        setHasError(false);
      } catch (error) {
        handleMapError(error);
      }
    };

    loadYandexMaps();

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
        } catch (error) {
          console.error('Error destroying map:', error);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (placemarkRef.current && mapInstanceRef.current) {
      try {
        placemarkRef.current.geometry.setCoordinates([latitude, longitude]);
        mapInstanceRef.current.setCenter([latitude, longitude], 15);
      } catch (error) {
        console.error('Error updating map:', error);
      }
    }
  }, [latitude, longitude]);

  const handleLatitudeChange = (value: string) => {
    const lat = parseFloat(value);
    if (!isNaN(lat) && lat >= -90 && lat <= 90) {
      onLocationChange(lat, longitude);
    }
  };

  const handleLongitudeChange = (value: string) => {
    const lng = parseFloat(value);
    if (!isNaN(lng) && lng >= -180 && lng <= 180) {
      onLocationChange(latitude, lng);
    }
  };

  return (
    <div className="space-y-4">
      {hasError ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : (
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
          {!isLoading && !hasError && (
            <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm p-2 rounded-md text-xs text-muted-foreground">
              Кликните по карте или перетащите маркер для выбора точки
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Широта</Label>
          <Input
            id="latitude"
            type="number"
            step="0.000001"
            min="-90"
            max="90"
            value={latitude.toFixed(6)}
            onChange={(e) => handleLatitudeChange(e.target.value)}
            data-testid="input-latitude"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Долгота</Label>
          <Input
            id="longitude"
            type="number"
            step="0.000001"
            min="-180"
            max="180"
            value={longitude.toFixed(6)}
            onChange={(e) => handleLongitudeChange(e.target.value)}
            data-testid="input-longitude"
          />
        </div>
      </div>
    </div>
  );
}
