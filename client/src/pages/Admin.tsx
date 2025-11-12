import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar, Package, Image as ImageIcon, ShoppingCart, Users, LogOut, Plus, Pencil, Trash2, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Admin, Event, Location, Product, Photo, Order } from "@shared/schema";
import { RichTextEditor } from "@/components/RichTextEditor";

export default function Admin() {
  const [_, setLocation] = useLocation();
  const { admin, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("events");

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
          <Card 
            className="cursor-pointer hover-elevate transition-colors"
            onClick={() => setActiveTab("events")}
            data-testid="card-events"
          >
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

          <Card 
            className="cursor-pointer hover-elevate transition-colors"
            onClick={() => setActiveTab("products")}
            data-testid="card-products"
          >
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

          <Card 
            className="cursor-pointer hover-elevate transition-colors"
            onClick={() => setActiveTab("photos")}
            data-testid="card-photos"
          >
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

          <Card 
            className="cursor-pointer hover-elevate transition-colors"
            onClick={() => setActiveTab("orders")}
            data-testid="card-orders"
          >
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">События</TabsTrigger>
            <TabsTrigger value="products">Товары</TabsTrigger>
            <TabsTrigger value="photos">Фотографии</TabsTrigger>
            <TabsTrigger value="orders">Заказы</TabsTrigger>
            <TabsTrigger value="home">Главная страница</TabsTrigger>
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

          <TabsContent value="home">
            <HomeSettingsManagement />
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
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [eventType, setEventType] = useState("club");
  const [locationId, setLocationId] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [status, setStatus] = useState("draft");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [gpxFile, setGpxFile] = useState<File | null>(null);

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: locations } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartsAt("");
    setEventType("club");
    setLocationId("none");
    setDistanceKm("");
    setStatus("draft");
    setCoverImage(null);
    setGpxFile(null);
    setEditingEvent(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description || "");
    setStartsAt(new Date(event.startsAt).toISOString().slice(0, 16));
    setEventType(event.eventType || "club");
    setLocationId(event.locationId || "none");
    setDistanceKm(event.distanceKm?.toString() || "");
    setStatus(event.status);
    setCoverImage(null);
    setGpxFile(null);
    setDialogOpen(true);
  };

  const saveEventMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim() || !startsAt) {
        toast({
          title: "Ошибка",
          description: "Заполните все обязательные поля",
          variant: "destructive",
        });
        return;
      }

      const eventData = {
        title: title.trim(),
        description: description.trim() || "<p>Описание скоро появится</p>",
        startsAt: new Date(startsAt).toISOString(),
        eventType,
        locationId: locationId && locationId !== "none" ? locationId : null,
        distanceKm: distanceKm ? parseFloat(distanceKm) : null,
        status,
        slug: editingEvent ? editingEvent.slug : title.trim().toLowerCase().replace(/[^a-zа-я0-9]+/g, '-'),
      };

      let savedEvent;
      if (editingEvent) {
        const response = await apiRequest("PATCH", `/api/events/${editingEvent.id}`, eventData);
        savedEvent = await response.json();
      } else {
        const response = await apiRequest("POST", "/api/events", eventData);
        savedEvent = await response.json();
      }

      if (coverImage && savedEvent?.id) {
        const formData = new FormData();
        formData.append('cover', coverImage);
        await fetch(`/api/events/${savedEvent.id}/cover`, {
          method: 'POST',
          body: formData,
        });
      }

      if (gpxFile && savedEvent?.id) {
        const formData = new FormData();
        formData.append('gpx', gpxFile);
        await fetch(`/api/events/${savedEvent.id}/gpx`, {
          method: 'POST',
          body: formData,
        });
      }

      return savedEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setDialogOpen(false);
      resetForm();
      toast({
        title: editingEvent ? "Событие обновлено" : "Событие создано",
        description: editingEvent ? "Изменения сохранены" : "Новое событие добавлено",
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

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Событие удалено",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Управление событиями</CardTitle>
            <CardDescription>Список всех забегов клуба</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} data-testid="button-create-event">
                <Plus className="h-4 w-4 mr-2" />
                Создать событие
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingEvent ? "Редактировать событие" : "Создать событие"}</DialogTitle>
                <DialogDescription>
                  {editingEvent ? "Измените данные забега" : "Добавьте новый забег"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Название *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Забег у Пушкина"
                    data-testid="input-event-title"
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <RichTextEditor
                    content={description}
                    onChange={setDescription}
                    placeholder="Подробное описание забега..."
                  />
                </div>
                <div>
                  <Label htmlFor="startsAt">Дата и время *</Label>
                  <Input
                    id="startsAt"
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    data-testid="input-event-starts-at"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventType">Тип события</Label>
                    <Select value={eventType} onValueChange={setEventType}>
                      <SelectTrigger id="eventType" data-testid="select-event-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="club">Клубный</SelectItem>
                        <SelectItem value="irregular">Внештатный</SelectItem>
                        <SelectItem value="out_of_town">Выездной</SelectItem>
                        <SelectItem value="city">Городской</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="locationId">Локация</Label>
                    <Select value={locationId} onValueChange={setLocationId}>
                      <SelectTrigger id="locationId" data-testid="select-location">
                        <SelectValue placeholder="Выберите локацию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Без локации</SelectItem>
                        {locations?.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="distanceKm">
                    Дистанция (км) {editingEvent?.gpxUrl && "(из GPX)"}
                  </Label>
                  <Input
                    id="distanceKm"
                    type="number"
                    step="0.1"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                    placeholder="5.5"
                    readOnly={!!editingEvent?.gpxUrl}
                    className={editingEvent?.gpxUrl ? "bg-muted" : ""}
                    data-testid="input-event-distance"
                  />
                  {editingEvent?.gpxUrl && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Дистанция рассчитывается автоматически из GPX файла
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="coverImage">Обложка события</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                      data-testid="input-event-cover"
                    />
                    {coverImage && (
                      <span className="text-sm text-muted-foreground">{coverImage.name}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="gpxFile">GPX файл маршрута</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="gpxFile"
                      type="file"
                      accept=".gpx"
                      onChange={(e) => setGpxFile(e.target.files?.[0] || null)}
                      data-testid="input-event-gpx"
                    />
                    {gpxFile && (
                      <span className="text-sm text-muted-foreground">{gpxFile.name}</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Статус</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger data-testid="select-event-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Черновик</SelectItem>
                      <SelectItem value="published">Опубликовано</SelectItem>
                      <SelectItem value="archived">Архив</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setDialogOpen(false)} data-testid="button-cancel-event">
                    Отмена
                  </Button>
                  <Button 
                    onClick={() => saveEventMutation.mutate()}
                    disabled={!title || !startsAt || saveEventMutation.isPending}
                    data-testid="button-save-event"
                  >
                    {saveEventMutation.isPending ? "Сохранение..." : editingEvent ? "Обновить" : "Создать"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border rounded-lg"
                data-testid={`event-item-${event.id}`}
              >
                <div className="flex-1">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.startsAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })} 
                    {event.locationId && ` • ${locations?.find(l => l.id === event.locationId)?.name || 'Локация'}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.eventType === 'club' && 'Клубный'}
                    {event.eventType === 'irregular' && 'Внештатный'}
                    {event.eventType === 'out_of_town' && 'Выездной'}
                    {event.eventType === 'city' && 'Городской'}
                    {' • '}
                    {event.status === 'draft' && 'Черновик'}
                    {event.status === 'published' && 'Опубликовано'}
                    {event.status === 'archived' && 'Архив'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(event)}
                    data-testid={`button-edit-event-${event.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteEventMutation.mutate(event.id)}
                    disabled={deleteEventMutation.isPending}
                    data-testid={`button-delete-event-${event.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const productFormSchema = z.object({
    title: z.string().min(1, "Название обязательно"),
    description: z.string().min(1, "Описание обязательно"),
    category: z.string().min(1, "Категория обязательна"),
    basePrice: z.preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return null;
        const num = Number(val);
        return isNaN(num) ? null : num;
      },
      z.number().min(0, "Цена должна быть положительной").nullable()
    ),
    active: z.boolean().default(true),
  });

  const productForm = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      basePrice: null,
      active: true,
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: z.infer<typeof productFormSchema>) => {
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-zа-я0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const productData: any = {
        title: data.title,
        description: data.description,
        category: data.category,
        slug,
        images: [],
        active: data.active,
      };

      if (data.basePrice !== null && data.basePrice !== undefined) {
        productData.basePrice = data.basePrice;
      }

      const response = await apiRequest("POST", "/api/products", productData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Товар создан",
      });
      productForm.reset();
      setIsCreateDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка создания товара",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Товар удалён",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Управление товарами</CardTitle>
            <CardDescription>
              Каталог мерча клуба
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-product">
                <Plus className="h-4 w-4 mr-2" />
                Добавить товар
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Создать товар</DialogTitle>
                <DialogDescription>
                  Добавьте новый товар в каталог мерча
                </DialogDescription>
              </DialogHeader>
              <Form {...productForm}>
                <form onSubmit={productForm.handleSubmit((data) => createProductMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={productForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название *</FormLabel>
                        <FormControl>
                          <Input placeholder="Футболка MRC" {...field} data-testid="input-product-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={productForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Описание товара..." {...field} data-testid="input-product-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={productForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Категория *</FormLabel>
                        <FormControl>
                          <Input placeholder="Одежда" {...field} data-testid="input-product-category" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={productForm.control}
                    name="basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Базовая цена (₽)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1500"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            data-testid="input-product-price"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={productForm.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Активный</FormLabel>
                          <FormDescription>
                            Товар будет отображаться в каталоге
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="w-4 h-4"
                            data-testid="checkbox-product-active"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button type="submit" disabled={createProductMutation.isPending} data-testid="button-submit-product">
                      {createProductMutation.isPending ? "Создание..." : "Создать товар"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      data-testid="button-cancel-product"
                    >
                      Отмена
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {products && products.length > 0 ? (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-lg"
                data-testid={`product-item-${product.id}`}
              >
                <div className="flex-1">
                  <p className="font-medium">{product.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category} • {product.basePrice ? `${product.basePrice} ₽` : 'Цена не указана'}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteProductMutation.mutate(product.id)}
                  disabled={deleteProductMutation.isPending}
                  data-testid={`button-delete-product-${product.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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
  const { toast } = useToast();
  const { data: photos } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events?status=published"],
  });

  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const uploadPhotoSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    eventId: z.string().optional(),
  });

  const uploadForm = useForm<z.infer<typeof uploadPhotoSchema>>({
    resolver: zodResolver(uploadPhotoSchema),
    defaultValues: {
      title: "",
      description: "",
      eventId: "none",
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: async (data: z.infer<typeof uploadPhotoSchema>) => {
      if (!uploadFile) {
        throw new Error("No file selected");
      }

      const formData = new FormData();
      formData.append("photo", uploadFile);
      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.eventId && data.eventId !== "none") formData.append("eventId", data.eventId);

      const response = await fetch("/api/photos", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload photo");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({
        title: "Фото загружено",
        description: "Фото добавлено и ожидает модерации",
      });
      uploadForm.reset();
      setUploadFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка загрузки",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePhotoMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/photos/${id}`, { status });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({
        title: "Статус фото обновлён",
      });
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/photos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({
        title: "Фото удалено",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Модерация фотографий</CardTitle>
        <CardDescription>
          Галерея фотографий с забегов. Одобряйте или отклоняйте загруженные фото
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Загрузить фотографию</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...uploadForm}>
              <form onSubmit={uploadForm.handleSubmit((data) => uploadPhotoMutation.mutate(data))} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="photo-file" data-testid="label-photo-file">Фотография *</Label>
                  <Input
                    id="photo-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    data-testid="input-photo-file"
                  />
                </div>

                <FormField
                  control={uploadForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название (опционально)</FormLabel>
                      <FormControl>
                        <Input placeholder="Финиш забега" {...field} data-testid="input-photo-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={uploadForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание (опционально)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Описание фотографии..." {...field} data-testid="input-photo-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={uploadForm.control}
                  name="eventId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Событие (опционально)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-photo-event">
                            <SelectValue placeholder="Выберите событие" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Без события</SelectItem>
                          {events?.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={!uploadFile || uploadPhotoMutation.isPending} data-testid="button-upload-photo">
                  {uploadPhotoMutation.isPending ? "Загрузка..." : "Загрузить фото"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        {photos && photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="border rounded-lg overflow-hidden"
                data-testid={`photo-item-${photo.id}`}
              >
                <img 
                  src={photo.url} 
                  alt={photo.title || "Photo"} 
                  className="w-full h-48 object-cover grayscale" 
                />
                <div className="p-3 space-y-2">
                  <p className="text-sm font-medium truncate">{photo.title || 'Без названия'}</p>
                  <p className="text-xs text-muted-foreground">
                    Статус: {photo.status === 'pending' && 'На модерации'}
                    {photo.status === 'approved' && 'Одобрено'}
                    {photo.status === 'rejected' && 'Отклонено'}
                  </p>
                  <div className="flex gap-2">
                    {photo.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => updatePhotoMutation.mutate({ id: photo.id, status: 'approved' })}
                          disabled={updatePhotoMutation.isPending}
                          data-testid={`button-approve-photo-${photo.id}`}
                        >
                          Одобрить
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => updatePhotoMutation.mutate({ id: photo.id, status: 'rejected' })}
                          disabled={updatePhotoMutation.isPending}
                          data-testid={`button-reject-photo-${photo.id}`}
                        >
                          Отклонить
                        </Button>
                      </>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deletePhotoMutation.mutate(photo.id)}
                      disabled={deletePhotoMutation.isPending}
                      data-testid={`button-delete-photo-${photo.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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

const homeSettingsFormSchema = z.object({
  heroTitle: z.string().min(1, "Заголовок обязателен"),
  heroSubtitle: z.string().min(1, "Подзаголовок обязателен"),
  aboutTitle: z.string().min(1, "Заголовок обязателен"),
  aboutText1: z.string().min(1, "Текст обязателен"),
  aboutText2: z.string().min(1, "Текст обязателен"),
  statsParticipants: z.string().min(1, "Значение обязательно"),
  statsCities: z.string().min(1, "Значение обязательно"),
  statsRuns: z.string().min(1, "Значение обязательно"),
  statsKilometers: z.string().min(1, "Значение обязательно"),
});

type HomeSettingsFormValues = z.infer<typeof homeSettingsFormSchema>;

function HomeSettingsManagement() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useQuery<{
    id: string;
    heroImageUrl: string | null;
    heroTitle: string;
    heroSubtitle: string;
    aboutTitle: string;
    aboutText1: string;
    aboutText2: string;
    statsParticipants: string;
    statsCities: string;
    statsRuns: string;
    statsKilometers: string;
    updatedAt: Date;
  }>({
    queryKey: ["/api/home-settings"],
  });

  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

  const form = useForm<HomeSettingsFormValues>({
    resolver: zodResolver(homeSettingsFormSchema),
    defaultValues: {
      heroTitle: "",
      heroSubtitle: "",
      aboutTitle: "",
      aboutText1: "",
      aboutText2: "",
      statsParticipants: "",
      statsCities: "",
      statsRuns: "",
      statsKilometers: "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        heroTitle: settings.heroTitle || "",
        heroSubtitle: settings.heroSubtitle || "",
        aboutTitle: settings.aboutTitle || "",
        aboutText1: settings.aboutText1 || "",
        aboutText2: settings.aboutText2 || "",
        statsParticipants: settings.statsParticipants || "",
        statsCities: settings.statsCities || "",
        statsRuns: settings.statsRuns || "",
        statsKilometers: settings.statsKilometers || "",
      });
    }
  }, [settings, form]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: HomeSettingsFormValues) => {
      const response = await fetch("/api/home-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update settings");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/home-settings"] });
      toast({ title: "Настройки обновлены" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Ошибка обновления настроек", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const uploadHeroImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("hero", file);
      const response = await fetch("/api/home-settings/hero-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload hero image");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/home-settings"] });
      setHeroImageFile(null);
      toast({ title: "Hero изображение загружено" });
    },
    onError: () => {
      toast({ title: "Ошибка загрузки изображения", variant: "destructive" });
    },
  });

  const onSubmit = (data: HomeSettingsFormValues) => {
    updateSettingsMutation.mutate(data);
  };

  const handleHeroImageUpload = () => {
    if (heroImageFile) {
      uploadHeroImageMutation.mutate(heroImageFile);
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Загрузка настроек...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройки главной страницы</CardTitle>
        <CardDescription>
          Редактирование блоков на главной странице
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Hero блок</h3>
          
          <div>
            <Label htmlFor="heroImage">Hero изображение</Label>
            {settings?.heroImageUrl && (
              <div className="mb-2">
                <img
                  src={settings.heroImageUrl}
                  alt="Hero"
                  className="w-full max-w-md h-48 object-cover grayscale rounded-md"
                />
              </div>
            )}
            <div className="flex gap-2 items-center">
              <Input
                id="heroImage"
                type="file"
                accept="image/*"
                onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
                data-testid="input-hero-image"
              />
              <Button
                onClick={handleHeroImageUpload}
                disabled={!heroImageFile || uploadHeroImageMutation.isPending}
                data-testid="button-upload-hero-image"
              >
                {uploadHeroImageMutation.isPending ? "Загрузка..." : "Загрузить"}
              </Button>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="heroTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Заголовок Hero блока</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Mikkeller Running Club" 
                        data-testid="input-hero-title"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroSubtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Подзаголовок Hero блока</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Мы бегаем. Мы пьём пиво. Мы друзья." 
                        data-testid="input-hero-subtitle"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Блок "О клубе"</h3>
              
              <FormField
                control={form.control}
                name="aboutTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Заголовок</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="О клубе" 
                        data-testid="input-about-title"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aboutText1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Первый параграф</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={3}
                        data-testid="input-about-text1"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aboutText2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Второй параграф</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={3}
                        data-testid="input-about-text2"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Статистика</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="statsParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Участники</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1200+" 
                          data-testid="input-stats-participants"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="statsCities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Города</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="50+" 
                          data-testid="input-stats-cities"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="statsRuns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Забеги</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="500+" 
                          data-testid="input-stats-runs"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="statsKilometers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Километры</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="15K" 
                          data-testid="input-stats-kilometers"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={updateSettingsMutation.isPending}
              data-testid="button-save-home-settings"
            >
              {updateSettingsMutation.isPending ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </form>
        </Form>
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
                    {order.email} • {order.amountTotal} ₽
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Статус: {order.status === 'created' && 'Создан'}
                    {order.status === 'paid' && 'Оплачен'}
                    {order.status === 'failed' && 'Ошибка'}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(order.createdAt.toString())}
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
