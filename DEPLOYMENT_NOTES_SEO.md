# SEO Module Deployment Notes

## Что было добавлено

### 1. SEO Component (`client/src/components/SEO.tsx`)
- Универсальный компонент для управления meta-тегами
- Автоматическое удаление старых тегов перед добавлением новых
- Поддержка Open Graph и Twitter Cards
- Обработка относительных и абсолютных URL для изображений

### 2. SEO Configuration (`client/src/config/seo.ts`)
- Статические SEO данные для всех страниц
- Динамические функции для событий, товаров, локаций
- Fallback изображение `/uploads/hero/default.jpg` для всех страниц
- Двуязычный контент (русский/английский)

### 3. Применение на страницах
Все публичные страницы теперь имеют SEO:
- Home (с динамическим hero image из настроек)
- Events (статический)
- EventDetail (динамический: title, description, cover image)
- Locations (статический)
- LocationDetail (динамический: name, address, logo)
- Gallery (статический)
- Shop (статический)
- ProductDetail (динамический: name, price, description, image)
- About (статический)
- PaceCalculator (статический)

## Деплой

### Файлы для загрузки
```bash
deployment-seo-YYYYMMDD-HHMMSS.tar.gz
```

### Важно
1. Убедитесь что существует файл `/uploads/hero/default.jpg` для fallback OG image
2. Все динамические изображения (события, товары, локации) автоматически используются в OG tags
3. Meta теги очищаются при навигации между страницами

### Проверка после деплоя
1. Откройте любую страницу сайта
2. Проверьте в DevTools → Elements → `<head>` наличие:
   - `<title>`
   - `<meta name="description">`
   - `<meta property="og:title">`
   - `<meta property="og:image">`
   - `<meta property="og:url">`
3. Используйте [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
4. Используйте [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Технические детали

### Очистка тегов
При каждой навигации компонент удаляет старые теги:
- `meta[name="description"]`
- `meta[name="keywords"]`
- `meta[property="og:*"]`
- `meta[name="twitter:*"]`

Это предотвращает ситуации когда теги с предыдущей страницы остаются в DOM.

### Fallback стратегия
```
1. Динамическое изображение (coverImage, logoUrl, imageUrl)
2. DEFAULT_OG_IMAGE (/uploads/hero/default.jpg)
```

### Keywords
Каждая страница имеет оптимизированные ключевые слова на русском и английском для лучшей индексации в поисковых системах.

---
Дата: $(date +"%Y-%m-%d %H:%M:%S")
Версия: SEO Module v1.0
