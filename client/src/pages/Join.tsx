import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function Join() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "moscow",
    experience: "beginner",
    terms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="max-w-2xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Присоединяйтесь к MRC
          </h1>
          <p className="text-lg text-muted-foreground">
            Заполните форму, чтобы стать частью нашего беговог о сообщества
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Регистрация участника</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Имя и фамилия *</Label>
                <Input
                  id="name"
                  placeholder="Иван Иванов"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="input-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ivan@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Город *</Label>
                <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                  <SelectTrigger id="city" data-testid="select-city">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="moscow">Москва</SelectItem>
                    <SelectItem value="spb">Санкт-Петербург</SelectItem>
                    <SelectItem value="other">Другой город</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Опыт бега</Label>
                <Select value={formData.experience} onValueChange={(value) => setFormData({ ...formData, experience: value })}>
                  <SelectTrigger id="experience" data-testid="select-experience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Новичок</SelectItem>
                    <SelectItem value="intermediate">Средний уровень</SelectItem>
                    <SelectItem value="advanced">Опытный бегун</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={formData.terms}
                    onCheckedChange={(checked) => setFormData({ ...formData, terms: checked as boolean })}
                    data-testid="checkbox-terms"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    Я согласен с правилами клуба и политикой конфиденциальности. Я понимаю, что занятия спортом могут быть связаны с рисками для здоровья.
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!formData.terms}
                data-testid="button-submit-join"
              >
                Присоединиться к клубу
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                После регистрации вы получите письмо с информацией о ближайших забегах
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Есть вопросы?{" "}
            <a href="#" className="text-primary hover:underline">
              Свяжитесь с нами
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
