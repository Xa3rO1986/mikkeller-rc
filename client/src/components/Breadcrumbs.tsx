import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4" data-testid="breadcrumbs">
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        <li className="flex items-center gap-2">
          <Link href="/" className="hover-elevate px-2 py-1 rounded-md flex items-center gap-1" data-testid="breadcrumb-home">
            <Home className="h-4 w-4" />
            <span>Главная</span>
          </Link>
          {items.length > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link 
                  href={item.href} 
                  className="hover-elevate px-2 py-1 rounded-md"
                  data-testid={`breadcrumb-${index}`}
                >
                  {item.label}
                </Link>
              ) : (
                <span 
                  className="text-muted-foreground px-2 py-1"
                  data-testid={`breadcrumb-${index}`}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
