import { useState } from "react";

interface PhotoCardProps {
  id: string;
  url: string;
  title?: string;
  eventTitle?: string;
  onClick?: () => void;
  grayscale?: boolean;
}

export default function PhotoCard({ id, url, title, eventTitle, onClick, grayscale = false }: PhotoCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-lg cursor-pointer hover-elevate group ${grayscale ? 'grayscale hover:grayscale-0 transition-all' : ''}`}
      onClick={onClick}
      data-testid={`photo-${id}`}
    >
      <img
        src={url}
        alt={title || 'Event photo'}
        className={`w-full h-full object-cover transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      {(title || eventTitle) && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {title && <p className="text-white font-medium text-sm">{title}</p>}
          {eventTitle && <p className="text-white/80 text-xs">{eventTitle}</p>}
        </div>
      )}
    </div>
  );
}
