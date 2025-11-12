import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface ProductCardProps {
  slug: string;
  title: string;
  price: number;
  currency?: string;
  image: string;
  category: string;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
}

export default function ProductCard({
  slug,
  title,
  price,
  currency = "₽",
  image,
  category,
  sizes = [],
  colors = [],
  inStock = true,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:-translate-y-1 transition-transform" data-testid={`card-product-${slug}`}>
      <div className="relative h-64 overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary">Нет в наличии</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="mb-2">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        </div>

        <h3 className="font-semibold text-lg mb-2">{title}</h3>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold">{price.toLocaleString()}</span>
          <span className="text-muted-foreground">{currency}</span>
        </div>

        {sizes.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1">Размеры:</p>
            <div className="flex flex-wrap gap-1">
              {sizes.map((size) => (
                <Badge key={size} variant="secondary" className="text-xs">
                  {size}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {colors.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-1">Цвета: {colors.join(', ')}</p>
          </div>
        )}

        <Link href={`/shop/${slug}`}>
          <Button className="w-full" disabled={!inStock} data-testid={`button-product-${slug}`}>
            {inStock ? 'Подробнее' : 'Нет в наличии'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
