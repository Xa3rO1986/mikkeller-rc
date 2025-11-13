import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MapPin } from "lucide-react";
import { Link } from "wouter";
import type { Location } from "@shared/schema";

export default function Locations() {
  const { data: locations = [], isLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <Breadcrumbs items={[{ label: "Локации" }]} />
        
        <div className="mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Локации забегов</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Места, где проходят наши регулярные забеги. Каждая локация — это особенная точка на карте нашего сообщества.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Загрузка локаций...</p>
          </div>
        ) : locations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <Link key={location.id} href={`/locations/${location.slug}`}>
                <Card 
                  className="hover:-translate-y-1 transition-transform border-2 border-black h-full cursor-pointer"
                  data-testid={`card-location-${location.slug}`}
                >
                  <CardHeader>
                    {location.logoUrl && (
                      <img
                        src={location.logoUrl}
                        alt={`${location.name} logo`}
                        className="h-12 w-auto object-contain mb-3"
                        data-testid={`img-location-logo-${location.slug}`}
                      />
                    )}
                    <CardTitle className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                      <span>{location.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {location.address}
                    </p>
                    {location.description && (
                      <p className="text-sm line-clamp-3">
                        {location.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Локации скоро появятся</p>
          </div>
        )}
      </div>
    </div>
  );
}
