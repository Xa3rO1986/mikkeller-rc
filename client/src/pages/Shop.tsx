import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { seoPages } from "@/config/seo";

import product1 from '@assets/generated_images/Black_running_t-shirt_product_3eadb9cf.png';
import product2 from '@assets/generated_images/Yellow_tank_top_product_c8520cd2.png';
import product3 from '@assets/generated_images/Teal_hoodie_product_ad3ee456.png';

export default function Shop() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");

  const products = [
    {
      slug: "black-running-tee",
      title: "Беговая футболка MRC",
      price: 2500,
      image: product1,
      category: "Футболки",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Черный", "Желтый"],
      inStock: true,
    },
    {
      slug: "yellow-tank-top",
      title: "Майка MRC Yellow",
      price: 2200,
      image: product2,
      category: "Майки",
      sizes: ["S", "M", "L"],
      colors: ["Желтый"],
      inStock: true,
    },
    {
      slug: "teal-hoodie",
      title: "Худи MRC Teal",
      price: 4500,
      image: product3,
      category: "Толстовки",
      sizes: ["M", "L", "XL"],
      colors: ["Бирюзовый"],
      inStock: true,
    },
    {
      slug: "black-tee-2",
      title: "Классическая футболка",
      price: 2300,
      image: product1,
      category: "Футболки",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Черный"],
      inStock: false,
    },
    {
      slug: "running-shorts",
      title: "Беговые шорты",
      price: 2800,
      image: product2,
      category: "Шорты",
      sizes: ["S", "M", "L"],
      colors: ["Черный", "Серый"],
      inStock: true,
    },
    {
      slug: "water-bottle",
      title: "Бутылка для воды MRC",
      price: 1200,
      image: product3,
      category: "Аксессуары",
      sizes: [],
      colors: ["Желтый"],
      inStock: true,
    },
  ];

  return (
    <>
      <SEO {...seoPages.shop} />
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Breadcrumbs items={[{ label: "Магазин" }]} />
        
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Магазин</h1>
          <p className="text-lg text-muted-foreground">
            Официальный мерч Mikkeller Running Club
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-category">
              <SelectValue placeholder="Категория" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              <SelectItem value="tees">Футболки</SelectItem>
              <SelectItem value="tanks">Майки</SelectItem>
              <SelectItem value="hoodies">Толстовки</SelectItem>
              <SelectItem value="shorts">Шорты</SelectItem>
              <SelectItem value="accessories">Аксессуары</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sizeFilter} onValueChange={setSizeFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-size">
              <SelectValue placeholder="Размер" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все размеры</SelectItem>
              <SelectItem value="s">S</SelectItem>
              <SelectItem value="m">M</SelectItem>
              <SelectItem value="l">L</SelectItem>
              <SelectItem value="xl">XL</SelectItem>
              <SelectItem value="xxl">XXL</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setCategoryFilter("all");
              setSizeFilter("all");
            }}
            data-testid="button-reset-shop-filters"
          >
            Сбросить фильтры
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
        </div>
      </div>
    </>
  );
}
