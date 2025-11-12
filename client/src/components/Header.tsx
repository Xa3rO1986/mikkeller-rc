import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun, User } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/events", label: "Забеги" },
    { href: "/gallery", label: "Галерея" },
    { href: "/shop", label: "Магазин" },
    { href: "/about", label: "О клубе" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 font-bold text-xl hover-elevate px-2 py-1 rounded-md" 
            data-testid="link-home"
          >
            <span className="text-primary">MRC</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover-elevate ${
                  location === link.href
                    ? "bg-muted"
                    : ""
                }`}
                data-testid={`link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleDarkMode}
              data-testid="button-theme-toggle"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-user">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="default" className="hidden md:inline-flex" data-testid="button-join">
              Присоединиться
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="block px-4 py-2 rounded-md text-sm font-medium hover-elevate"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
