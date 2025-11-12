import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Package, Image as ImageIcon, ShoppingCart } from "lucide-react";
import type { User } from "@shared/schema";
import { Link } from "wouter";

export default function Admin() {
  const { data: currentUser, isLoading } = useQuery<User | null>({
    queryKey: ['/api/user'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'EDITOR')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Доступ запрещён</h1>
            <p className="text-muted-foreground mb-4">
              {!currentUser 
                ? "Необходимо войти в систему для доступа к административной панели"
                : "У вас нет прав для доступа к административной панели"
              }
            </p>
            <Link href="/">
              <Button data-testid="button-back-home">На главную</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Административная панель</h1>
          <p className="text-muted-foreground">
            Добро пожаловать, {currentUser.firstName || currentUser.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">События</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Управление</div>
              <p className="text-xs text-muted-foreground">
                Создание и редактирование забегов
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Товары</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Каталог</div>
              <p className="text-xs text-muted-foreground">
                Управление мерчем клуба
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Фотографии</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Модерация</div>
              <p className="text-xs text-muted-foreground">
                Одобрение загруженных фото
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Заказы</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Просмотр</div>
              <p className="text-xs text-muted-foreground">
                История покупок
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="space-y-4">
          <TabsList>
            <TabsTrigger value="events" data-testid="tab-admin-events">
              События
            </TabsTrigger>
            <TabsTrigger value="products" data-testid="tab-admin-products">
              Товары
            </TabsTrigger>
            <TabsTrigger value="photos" data-testid="tab-admin-photos">
              Фотографии
            </TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-admin-orders">
              Заказы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление событиями</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Функционал в разработке
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление товарами</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Функционал в разработке
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Модерация фотографий</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Функционал в разработке
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>История заказов</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Функционал в разработке
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
