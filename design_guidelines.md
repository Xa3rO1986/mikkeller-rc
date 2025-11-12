# Mikkeller Running Club Design Guidelines

## Design Approach
**Minimalist Monochrome:** Строгий черно-белый дизайн, вдохновленный минималистичными спортивными брендами. Акцент на типографике, четких линиях и контрасте.

## Color Strategy
**Monochrome Palette:**
- Primary: Pure Black `#000000`
- Background: Pure White `#FFFFFF`
- Grays: 50%, 70%, 90% for hierarchy and subtle accents
- Application: Черный для текста, кнопок и акцентов. Белый для фона. Никаких цветных элементов.

## Typography System
**Font Stack:**
- Headings: **Inter** (700, 600) - Bold, clean, athletic
- Body: **Inter** (400, 500) - Excellent readability
- Accents: **Space Grotesk** (600) - For event titles and special callouts
- Sizes: Hero (text-5xl/text-6xl), H1 (text-4xl), H2 (text-3xl), H3 (text-2xl), Body (text-base), Small (text-sm)

## Layout & Spacing System
**Tailwind Units:** Primary spacing rhythm uses `4, 6, 8, 12, 16, 20, 24` (p-4, gap-6, mb-8, py-12, etc.)
- Section padding: `py-16 lg:py-24`
- Component spacing: `gap-6` or `gap-8`
- Card padding: `p-6` or `p-8`
- Container: `max-w-7xl mx-auto px-4 lg:px-8`

## Page-Specific Layouts

### Homepage (/)
- **Hero:** Full-width with large lifestyle image of runners, overlaid logo, tagline. Height: `min-h-[600px] lg:min-h-[700px]`
- **Upcoming Event Card:** Featured prominently below hero, minimalist layout with clear typography
- **Photo Grid:** 3-column grid on desktop (2-col tablet, 1-col mobile) showing recent run photos
- **Bars Section:** Список баров-партнеров с адресами и ссылками

### Events Page (/events)
- **Filters Bar:** Horizontal toolbar with date/location/distance selectors
- **Event Grid:** 2-column cards (1-col mobile), each showing cover image, date, distance, location
- **Card Design:** Image top, content below, black borders

### Event Detail (/events/[slug])
- **Hero Section:** Large event cover image with title overlay and key stats (date, distance, elevation)
- **Info Layout:** Single column layout for description/details, no registration button
- **GPX Map:** Full-width map showing route polyline in black, start/finish markers
- **Metrics Bar:** Horizontal stat cards showing distance, elevation gain
- **Photo Gallery:** Grid below map, 3-column responsive
- **Bar Info:** Информация о баре-точке старта/финиша

### Gallery (/gallery)
- **Grid:** 3-4 columns desktop, responsive down to 1
- **Filter Bar:** Horizontal controls for events/dates, search input
- **Lightbox:** Full-screen overlay with black background

### Shop (/shop)
- **Product Grid:** 3-column cards (2-col tablet, 1-col mobile)
- **Product Card:** Square image, title, price, size/color indicators
- **Product Detail:** Image carousel left 50%, details right 50%

### About (/about)
- **Timeline Layout:** Vertical timeline with content blocks showing club history
- **Stats Section:** 4-column grid with large numbers (members, bars, total km run)
- **Bars List:** Список баров-партнеров с адресами

### Admin (/admin)
- **Dashboard:** Tab navigation for sections (Events, Photos, Products, Orders)
- **Data Tables:** Striped rows, action buttons in right column
- **Forms:** Two-column layouts for create/edit

## Component Library

### Cards
- **Event Card:** Sharp corners or minimal rounding `rounded-md`, black border `border-2 border-black`, padding `p-6`
- **Product Card:** Clean borders, emphasis on product image
- **Photo Card:** No padding, image fills card

### Buttons
- **Primary:** Black background, white text, `px-6 py-3 rounded-lg font-semibold`
- **Secondary:** White background with black border and black text
- **On Images:** Black or white with appropriate contrast

### Badges
- **Status:** Small pills `px-3 py-1 rounded-full text-xs font-medium` with black borders
- **Tags:** Outlined style, black border

### Forms
- **Inputs:** Border `border-2 border-black`, focus ring in black, rounded `rounded-lg`, padding `px-4 py-3`
- **Validation:** Error messages in red below field

### Navigation
- **Header:** Sticky top, white background with black border, logo left, nav links center, auth buttons right
- **Footer:** Black background, white text, 4-column grid on desktop

## Date Format
- **Полный формат:** "15 ноября 2024" или "November 15, 2024" (в зависимости от локали)
- Всегда указывать месяц полностью, не сокращенно

## Bars (not Venues)
- Использовать термин "бар" вместо "место встречи"
- Бары являются точками старта/финиша для забегов
- Отображать название бара, адрес, ссылку на карту

## No Event Registration
- Убраны кнопки "Зарегистрироваться" на события
- События информационные, без онлайн-регистрации
- Вместо регистрации - кнопка "Скачать GPX" и "Добавить в календарь"

## Images
All images should have high contrast and work well in black and white context.

## Animations
**Minimal:**
- Card hover effects
- Simple transitions
- No color animations

## Accessibility
- High contrast (black on white, white on black)
- All images have descriptive alt text
- Focus indicators on all interactive elements
- Semantic HTML throughout
- Keyboard navigation

This minimalist black and white design creates a bold, focused experience centered around running community and bars as social hubs.
