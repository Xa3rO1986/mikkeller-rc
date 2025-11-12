import { useEffect, useRef, useState } from 'react';

interface GPXMapProps {
  gpxUrl: string;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

export function GPXMap({ gpxUrl }: GPXMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadYandexMaps = () => {
      if (window.ymaps) {
        initMap();
        return;
      }

      const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY || '';
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(initMap);
      };
      script.onerror = () => {
        setError('Ошибка загрузки Яндекс.Карт');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = new window.ymaps.Map(mapRef.current, {
        center: [55.7558, 37.6173],
        zoom: 13,
        controls: ['zoomControl', 'typeSelector', 'fullscreenControl'],
      }, {
        suppressMapOpenBlock: true,
      });

      map.controls.get('typeSelector').options.set({
        mapTypes: ['yandex#map', 'yandex#satellite', 'yandex#hybrid'],
      });

      mapInstanceRef.current = map;

      fetch(gpxUrl)
        .then(response => response.text())
        .then(gpxData => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(gpxData, 'text/xml');
          
          const trackPoints: [number, number][] = [];
          const trkpts = xmlDoc.getElementsByTagName('trkpt');
          
          for (let i = 0; i < trkpts.length; i++) {
            const lat = parseFloat(trkpts[i].getAttribute('lat') || '0');
            const lon = parseFloat(trkpts[i].getAttribute('lon') || '0');
            if (lat && lon) {
              trackPoints.push([lat, lon]);
            }
          }

          if (trackPoints.length === 0) {
            const rtepts = xmlDoc.getElementsByTagName('rtept');
            for (let i = 0; i < rtepts.length; i++) {
              const lat = parseFloat(rtepts[i].getAttribute('lat') || '0');
              const lon = parseFloat(rtepts[i].getAttribute('lon') || '0');
              if (lat && lon) {
                trackPoints.push([lat, lon]);
              }
            }
          }

          if (trackPoints.length > 0) {
            const polyline = new window.ymaps.Polyline(trackPoints, {}, {
              strokeColor: '#000000',
              strokeWidth: 4,
              strokeOpacity: 0.8,
            });
            map.geoObjects.add(polyline);

            const startPlacemark = new window.ymaps.Placemark(trackPoints[0], {
              hintContent: 'Старт',
            }, {
              preset: 'islands#darkGreenCircleDotIcon',
            });
            map.geoObjects.add(startPlacemark);

            const endPlacemark = new window.ymaps.Placemark(trackPoints[trackPoints.length - 1], {
              hintContent: 'Финиш',
            }, {
              preset: 'islands#darkRedCircleDotIcon',
            });
            map.geoObjects.add(endPlacemark);

            map.setBounds(polyline.geometry.getBounds(), {
              checkZoomRange: true,
              zoomMargin: 50,
            });
            
            setIsLoading(false);
          } else {
            setError('Не удалось найти точки маршрута в GPX файле');
            setIsLoading(false);
          }
        })
        .catch(err => {
          console.error('Error loading GPX:', err);
          setError('Ошибка загрузки маршрута');
          setIsLoading(false);
        });
    };

    loadYandexMaps();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [gpxUrl]);

  if (error) {
    return (
      <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
        <div className="text-center text-muted-foreground">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
          <div className="text-center text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-2"></div>
            <p className="text-sm">Загрузка карты...</p>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        data-testid="map-gpx"
      />
    </div>
  );
}
