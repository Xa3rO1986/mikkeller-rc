import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";

import product1 from '@assets/generated_images/Black_running_t-shirt_product_3eadb9cf.png';

export default function ProductDetail() {
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Черный");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [product1, product1, product1];
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = ["Черный", "Желтый"];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <Breadcrumbs items={[
          { label: "Магазин", href: "/shop" },
          { label: "Беговая футболка MRC" }
        ]} />
        
        <div className="grid lg:grid-cols-2 gap-12 mt-8">
          <div>
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden mb-4">
              <img
                src={images[currentImageIndex]}
                alt="Product"
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    data-testid="button-prev-image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    data-testid="button-next-image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    idx === currentImageIndex ? 'border-primary' : 'border-transparent'
                  }`}
                  data-testid={`button-thumbnail-${idx}`}
                >
                  <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Badge variant="outline" className="mb-4">Футболки</Badge>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Беговая футболка MRC
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold">2,500</span>
              <span className="text-xl text-muted-foreground">₽</span>
            </div>

            <p className="text-muted-foreground mb-8">
              Премиум беговая футболка из дышащей ткани с логотипом Mikkeller Running Club. Идеальна для тренировок и забегов.
            </p>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium mb-3">Размер</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      data-testid={`button-size-${size}`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Цвет</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      onClick={() => setSelectedColor(color)}
                      data-testid={`button-color-${color}`}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Количество</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    data-testid="button-decrease-quantity"
                  >
                    -
                  </Button>
                  <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    data-testid="button-increase-quantity"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <Button size="lg" className="flex-1" data-testid="button-add-to-cart">
                <ShoppingCart className="mr-2 h-5 w-5" />
                В корзину
              </Button>
              <Button size="lg" variant="outline" data-testid="button-favorite">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" data-testid="button-share-product">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="details">
                  <TabsList className="w-full">
                    <TabsTrigger value="details" className="flex-1">Детали</TabsTrigger>
                    <TabsTrigger value="sizing" className="flex-1">Размеры</TabsTrigger>
                    <TabsTrigger value="care" className="flex-1">Уход</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="mt-4">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Материал: 100% полиэстер</li>
                      <li>• Дышащая ткань с влагоотведением</li>
                      <li>• Плоские швы для комфорта</li>
                      <li>• Логотип MRC на груди</li>
                      <li>• Светоотражающие элементы</li>
                    </ul>
                  </TabsContent>
                  <TabsContent value="sizing" className="mt-4">
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">Таблица размеров (обхват груди, см):</p>
                      <ul className="space-y-1">
                        <li>S: 88-92</li>
                        <li>M: 94-98</li>
                        <li>L: 100-104</li>
                        <li>XL: 106-110</li>
                        <li>XXL: 112-116</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="care" className="mt-4">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Стирка при 30°C</li>
                      <li>• Не отбеливать</li>
                      <li>• Не гладить</li>
                      <li>• Сушить на воздухе</li>
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
