import type { SEOProps } from '@/components/SEO';
import { useQuery } from '@tanstack/react-query';

const DEFAULT_OG_IMAGE = '/uploads/hero/default.jpg';

interface PageSettingResponse {
  id: string;
  pageKey: string;
  title: string;
  description: string;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
}

export const defaultSEO: SEOProps = {
  title: 'Mikkeller Running Club — Беговой клуб Санкт-Петербург',
  description: 'Присоединяйтесь к беговому сообществу Mikkeller Running Club в Санкт-Петербурге. Еженедельные пробежки, маршруты с GPX-треками, фотогалерея событий и магазин брендовой экипировки.',
  keywords: 'беговой клуб санкт-петербург, mikkeller running club, бег спб, пробежки, running club saint petersburg, марафон подготовка',
  ogImage: DEFAULT_OG_IMAGE,
};

export const seoPages: Record<string, Omit<SEOProps, 'ogUrl'>> = {
  home: {
    title: 'Mikkeller Running Club — Беговой клуб Санкт-Петербург',
    description: 'Присоединяйтесь к беговому сообществу Mikkeller Running Club в Санкт-Петербурге. Еженедельные пробежки, маршруты с GPX-треками, фотогалерея событий и магазин брендовой экипировки.',
    keywords: 'беговой клуб санкт-петербург, mikkeller running club, бег спб, пробежки, running club saint petersburg',
    ogTitle: 'Mikkeller Running Club Saint Petersburg',
    ogDescription: 'Join the Mikkeller Running Club community in Saint Petersburg. Weekly runs, GPX routes, photo gallery, and branded gear shop.',
    ogImage: DEFAULT_OG_IMAGE,
  },
  
  events: {
    title: 'События — Mikkeller Running Club',
    description: 'Расписание предстоящих забегов и прошедших событий Mikkeller Running Club. Маршруты с GPX-треками, фотографии и детали каждой пробежки.',
    keywords: 'расписание забегов санкт-петербург, беговые события, mikkeller runs, gpx треки',
    ogTitle: 'Events — Mikkeller Running Club',
    ogDescription: 'Upcoming runs and past events schedule with GPX routes and photos.',
    ogImage: DEFAULT_OG_IMAGE,
  },
  
  locations: {
    title: 'Локации — Mikkeller Running Club',
    description: 'Места встреч и партнёрские бары Mikkeller Running Club в Санкт-Петербурге. Адреса, карты и информация о локациях для пробежек.',
    keywords: 'бары mikkeller санкт-петербург, места встреч бегунов, running locations saint petersburg',
    ogTitle: 'Locations — Mikkeller Running Club',
    ogDescription: 'Meeting points and partner bars in Saint Petersburg with maps and details.',
    ogImage: DEFAULT_OG_IMAGE,
  },
  
  gallery: {
    title: 'Фотогалерея — Mikkeller Running Club',
    description: 'Фотографии с пробежек Mikkeller Running Club. Атмосфера наших событий, участники и яркие моменты беговых встреч.',
    keywords: 'фото пробежек санкт-петербург, беговое сообщество фото, running club photos',
    ogTitle: 'Photo Gallery — Mikkeller Running Club',
    ogDescription: 'Photos from our runs, events, and community moments.',
    ogImage: DEFAULT_OG_IMAGE,
  },
  
  shop: {
    title: 'Магазин — Mikkeller Running Club',
    description: 'Официальный магазин брендовой экипировки Mikkeller Running Club. Футболки, шапки, аксессуары для бега с доставкой по России.',
    keywords: 'mikkeller одежда, беговая форма купить, running gear saint petersburg, мерч беговой клуб',
    ogTitle: 'Shop — Mikkeller Running Club',
    ogDescription: 'Official branded gear: t-shirts, caps, and running accessories with delivery across Russia.',
    ogImage: DEFAULT_OG_IMAGE,
  },
  
  about: {
    title: 'О клубе — Mikkeller Running Club',
    description: 'История и философия Mikkeller Running Club. Узнайте о нашем беговом сообществе, правилах участия и ценностях клуба.',
    keywords: 'о клубе mikkeller, беговое сообщество санкт-петербург, running club philosophy',
    ogTitle: 'About — Mikkeller Running Club',
    ogDescription: 'Our story, philosophy, and community values. Learn about the running club that combines fitness and social connection.',
    ogImage: DEFAULT_OG_IMAGE,
  },
  
  paceCalculator: {
    title: 'Калькулятор темпа — Mikkeller Running Club',
    description: 'Бесплатный онлайн калькулятор темпа бега. Рассчитайте время финиша, темп на километр и планируйте тренировки для марафона и полумарафона.',
    keywords: 'калькулятор темпа бега, pace calculator, темп на км, марафон калькулятор, полумарафон время',
    ogTitle: 'Pace Calculator — Mikkeller Running Club',
    ogDescription: 'Free online running pace calculator. Calculate finish time, pace per km, and plan your marathon training.',
    ogImage: DEFAULT_OG_IMAGE,
  },

  news: {
    title: 'Новости — Mikkeller Running Club',
    description: 'Последние новости и события Mikkeller Running Club в Санкт-Петербурге. Анонсы забегов, истории участников, достижения и жизнь бегового сообщества.',
    keywords: 'новости mikkeller, новости бегового клуба санкт-петербург, running club news, события клуба',
    ogTitle: 'News — Mikkeller Running Club',
    ogDescription: 'Latest news and updates from the Mikkeller Running Club community in Saint Petersburg.',
    ogImage: DEFAULT_OG_IMAGE,
  },
};

export function getEventSEO(title: string, description: string, coverImage?: string, slug?: string): SEOProps {
  const cleanDescription = description
    ? description.replace(/<[^>]*>/g, '').slice(0, 160)
    : 'Детали забега Mikkeller Running Club с маршрутом, временем старта и информацией о локации.';

  return {
    title: `${title} — События — Mikkeller Running Club`,
    description: cleanDescription,
    keywords: `${title}, забег москва, mikkeller run, беговое событие`,
    ogTitle: title,
    ogDescription: cleanDescription,
    ogImage: coverImage || DEFAULT_OG_IMAGE,
    ogUrl: slug ? `${window.location.origin}/events/${slug}` : undefined,
  };
}

export function getProductSEO(name: string, description: string, price: number, imageUrl?: string, slug?: string): SEOProps {
  const cleanDescription = description
    ? description.replace(/<[^>]*>/g, '').slice(0, 160)
    : `${name} — официальная продукция Mikkeller Running Club.`;

  return {
    title: `${name} — ${price} ₽ — Магазин — Mikkeller Running Club`,
    description: `${cleanDescription} Цена: ${price} ₽. Доставка по России.`,
    keywords: `${name}, mikkeller merch, беговая экипировка купить`,
    ogTitle: `${name} — ${price} ₽`,
    ogDescription: cleanDescription,
    ogImage: imageUrl || DEFAULT_OG_IMAGE,
    ogUrl: slug ? `${window.location.origin}/shop/${slug}` : undefined,
  };
}

export function getLocationSEO(name: string, address: string, description?: string, logoUrl?: string, slug?: string): SEOProps {
  const cleanDescription = description
    ? description.replace(/<[^>]*>/g, '').slice(0, 160)
    : `${name} — место встреч Mikkeller Running Club. Адрес: ${address}`;

  return {
    title: `${name} — Локации — Mikkeller Running Club`,
    description: cleanDescription,
    keywords: `${name}, ${address}, место встречи бегунов москва`,
    ogTitle: name,
    ogDescription: cleanDescription,
    ogImage: logoUrl || DEFAULT_OG_IMAGE,
    ogUrl: slug ? `${window.location.origin}/locations/${slug}` : undefined,
  };
}

export function getNewsSEO(title: string, excerpt: string, content: string, coverImage?: string, slug?: string): SEOProps {
  const cleanDescription = excerpt || (content
    ? content.replace(/<[^>]*>/g, '').slice(0, 160)
    : 'Новости и события Mikkeller Running Club.');

  return {
    title: `${title} — Новости — Mikkeller Running Club`,
    description: cleanDescription,
    keywords: `${title}, новости mikkeller, беговой клуб новости санкт-петербург`,
    ogTitle: title,
    ogDescription: cleanDescription,
    ogImage: coverImage || DEFAULT_OG_IMAGE,
    ogUrl: slug ? `${window.location.origin}/news/${slug}` : undefined,
  };
}

export function usePageSEO(pageKey: string): SEOProps {
  const { data } = useQuery<PageSettingResponse>({
    queryKey: [`/api/page-settings/${pageKey}`],
    staleTime: Infinity,
  });

  if (!data) {
    return seoPages[pageKey] || defaultSEO;
  }

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords || undefined,
    ogTitle: data.ogTitle || undefined,
    ogDescription: data.ogDescription || undefined,
    ogImage: data.ogImageUrl || DEFAULT_OG_IMAGE,
  };
}
