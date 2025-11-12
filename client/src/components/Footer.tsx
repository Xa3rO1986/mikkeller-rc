import { Link } from "wouter";
import { Instagram, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Mikkeller Running Club</h3>
            <p className="text-sm text-muted-foreground">
              Мы бегаем. Мы пьём пиво. Мы друзья.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/events" className="text-muted-foreground hover:text-foreground">Забеги</Link></li>
              <li><Link href="/gallery" className="text-muted-foreground hover:text-foreground">Галерея</Link></li>
              <li><Link href="/shop" className="text-muted-foreground hover:text-foreground">Магазин</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">О клубе</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Правила</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Конфиденциальность</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Контакты</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Соцсети</h4>
            <div className="flex gap-3">
              <a href="#" className="hover-elevate p-2 rounded-md" data-testid="link-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover-elevate p-2 rounded-md" data-testid="link-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover-elevate p-2 rounded-md" data-testid="link-youtube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Mikkeller Running Club. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
