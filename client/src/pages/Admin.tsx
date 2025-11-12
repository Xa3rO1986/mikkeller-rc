import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Package, Image as ImageIcon, ShoppingCart, Users, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Admin, Event, Product, Photo, Order } from "@shared/schema";

export default function Admin() {
  const [_, setLocation] = useLocation();
  const { admin, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/current"] });
      setLocation("/admin/login");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  if (!isAuthenticated || !admin) {
    return null;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Административная панель</h1>
            <p className="text-muted-foreground">
              Добро пожаловать, {admin.firstName || admin.username}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
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
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
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
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Фотографии</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Галерея</div>
              <p className="text-xs text-muted-foreground">
                Модерация фотографий
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Заказы</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Продажи</div>
              <p className="text-xs text-muted-foreground">
                Обработка заказов
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">События</TabsTrigger>
            <TabsTrigger value="products">Товары</TabsTrigger>
            <TabsTrigger value="photos">Фотографии</TabsTrigger>
            <TabsTrigger value="orders">Заказы</TabsTrigger>
            <TabsTrigger value="admins">Администраторы</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <EventsManagement />
          </TabsContent>

          <TabsContent value="products">
            <ProductsManagement />
          </TabsContent>

          <TabsContent value="photos">
            <PhotosManagement />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManagement />
          </TabsContent>

          <TabsContent value="admins">
            <AdminsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AdminsManagement() {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const { data: admins, isLoading } = useQuery<Omit<Admin, "passwordHash">[]>({
    queryKey: ["/api/admins"],
  });

  const createAdminMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admins", {
        username,
        passwordHash: password,
        firstName,
        lastName,
        email,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admins"] });
      setUsername("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setEmail("");
      toast({
        title: "Администратор создан",
        description: "Новый администратор успешно добавлен",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admins/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admins"] });
      toast({
        title: "Администратор удалён",
        description: "Администратор успешно удалён из системы",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Ошибка",
        description: "Логин и пароль обязательны",
        variant: "destructive",
      });
      return;
    }
    createAdminMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Добавить администратора</CardTitle>
          <CardDescription>
            Создайте новую учётную запись администратора
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" data-testid="label-admin-username">
                  Логин *
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={createAdminMutation.isPending}
                  data-testid="input-admin-username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" data-testid="label-admin-password">
                  Пароль *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={createAdminMutation.isPending}
                  data-testid="input-admin-password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName" data-testid="label-admin-firstname">
                  Имя
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={createAdminMutation.isPending}
                  data-testid="input-admin-firstname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" data-testid="label-admin-lastname">
                  Фамилия
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={createAdminMutation.isPending}
                  data-testid="input-admin-lastname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" data-testid="label-admin-email">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={createAdminMutation.isPending}
                  data-testid="input-admin-email"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={createAdminMutation.isPending}
              data-testid="button-create-admin"
            >
              {createAdminMutation.isPending ? "Создание..." : "Создать администратора"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список администраторов</CardTitle>
          <CardDescription>
            Управление существующими администраторами
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Загрузка...</p>
          ) : admins && admins.length > 0 ? (
            <div className="space-y-4">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  data-testid={`admin-item-${admin.id}`}
                >
                  <div>
                    <p className="font-medium">{admin.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {admin.firstName && admin.lastName
                        ? `${admin.firstName} ${admin.lastName}`
                        : admin.email || "Без имени"}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteAdminMutation.mutate(admin.id)}
                    disabled={deleteAdminMutation.isPending}
                    data-testid={`button-delete-admin-${admin.id}`}
                  >
                    Удалить
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Нет администраторов</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
function EventsManagement() {
  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление событиями</CardTitle>
        <CardDescription>
          Список всех забегов клуба
        </CardDescription>
      </CardHeader>
      <CardContent>
        {events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event: any) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.startsAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Нет событий</p>
        )}
      </CardContent>
    </Card>
  );
}

function ProductsManagement() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление товарами</CardTitle>
        <CardDescription>
          Каталог мерча клуба
        </CardDescription>
      </CardHeader>
      <CardContent>
        {products && products.length > 0 ? (
          <div className="space-y-4">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{product.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Нет товаров</p>
        )}
      </CardContent>
    </Card>
  );
}

function PhotosManagement() {
  const { data: photos } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Модерация фотографий</CardTitle>
        <CardDescription>
          Галерея фотографий с забегов
        </CardDescription>
      </CardHeader>
      <CardContent>
        {photos && photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo: any) => (
              <div
                key={photo.id}
                className="border rounded-lg overflow-hidden"
              >
                <img src={photo.url} alt={photo.title || "Photo"} className="w-full h-48 object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Нет фотографий</p>
        )}
      </CardContent>
    </Card>
  );
}

function OrdersManagement() {
  const { data: orders, isLoading, isError } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление заказами</CardTitle>
        <CardDescription>
          История продаж магазина
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Загрузка заказов...</p>
        ) : isError ? (
          <p className="text-destructive">Ошибка загрузки заказов</p>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg"
                data-testid={`order-item-${order.id}`}
              >
                <div>
                  <p className="font-medium">Заказ #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.email} • {order.totalPrice} ₽
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Статус: {order.paymentStatus}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(order.createdAt)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Нет заказов</p>
        )}
      </CardContent>
    </Card>
  );
}
