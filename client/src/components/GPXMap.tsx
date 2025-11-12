import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface GPXMapProps {
  gpxUrl: string;
}

export function GPXMap({ gpxUrl }: GPXMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [55.7558, 37.6173],
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      className: 'grayscale',
    }).addTo(map);

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
          const polyline = L.polyline(trackPoints, {
            color: '#000000',
            weight: 3,
            opacity: 0.8,
          }).addTo(map);

          map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

          L.marker(trackPoints[0], {
            icon: L.divIcon({
              className: 'custom-marker-start',
              html: '<div style="background-color: #000; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid #fff;">S</div>',
              iconSize: [24, 24],
            }),
          }).addTo(map);

          L.marker(trackPoints[trackPoints.length - 1], {
            icon: L.divIcon({
              className: 'custom-marker-end',
              html: '<div style="background-color: #000; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid #fff;">F</div>',
              iconSize: [24, 24],
            }),
          }).addTo(map);
        } else {
          setError('Не удалось найти точки маршрута в GPX файле');
        }
      })
      .catch(err => {
        console.error('Error loading GPX:', err);
        setError('Ошибка загрузки маршрута');
      });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [gpxUrl]);

  if (error) {
    return (
      <div className="aspect-video bg-muted flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="aspect-video w-full rounded-lg overflow-hidden"
      data-testid="map-gpx"
    />
  );
}
