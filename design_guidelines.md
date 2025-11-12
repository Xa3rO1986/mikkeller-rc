# Mikkeller Running Club Design Guidelines

## Design Approach
**Reference-Based Hybrid:** Drawing inspiration from active lifestyle brands (Strava, Nike Run Club) combined with Mikkeller's bold, playful brand identity. The design balances energetic community engagement with functional tools for event management and e-commerce.

## Color Strategy
**Brand Palette:**
- Primary Accent: Mikkeller Yellow `#FFD200`
- Secondary Accent: Dark Turquoise `#1A7B7B` 
- Neutrals: Pure black `#000000`, white `#FFFFFF`, grays for hierarchy
- Application: Yellow for primary CTAs and key highlights, turquoise for secondary actions and accent elements, black/white for content foundation

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
- **Hero:** Full-width (not 100vh) with large lifestyle image of runners, overlaid logo, tagline, and primary CTA with backdrop-blur background. Height: `min-h-[600px] lg:min-h-[700px]`
- **Upcoming Event Card:** Featured prominently below hero, asymmetric layout with date callout on left, details on right
- **Photo Grid:** 3-column grid on desktop (2-col tablet, 1-col mobile) showing recent run photos
- **About Section:** Two-column layout with text + community image
- **News Feed:** Card-based layout, 3 recent posts in grid

### Events Page (/events)
- **Filters Bar:** Horizontal sticky toolbar with date/location/distance selectors
- **Event Grid:** 2-column cards (1-col mobile), each showing cover image, date badge (large yellow circle), tags as small pills, location with map icon
- **Card Design:** Image top, content below, prominent date treatment

### Event Detail (/events/[slug])
- **Hero Section:** Large event cover image with title overlay and key stats (date, distance, elevation)
- **Two-Column Layout:** Left 60% for description/details, right 40% for action sidebar (download GPX, add to calendar buttons stacked)
- **GPX Map:** Full-width Leaflet map showing route polyline in turquoise, start/finish markers
- **Metrics Bar:** Horizontal stat cards showing distance, elevation gain, recommended pace
- **Photo Gallery:** Masonry grid below map, 3-column responsive
- **Upload Zone:** Drag-drop area for logged-in users, dashed border with yellow accent on hover
- **Comments:** Full-width Disqus embed at bottom

### Gallery (/gallery)
- **Masonry Grid:** 3-4 columns desktop, responsive down to 1
- **Filter Bar:** Horizontal chips for events/dates, search input
- **Lightbox:** Full-screen overlay with black background, image centered, navigation arrows, close button top-right

### Shop (/shop)
- **Product Grid:** 3-column cards (2-col tablet, 1-col mobile)
- **Product Card:** Square image, title, price, size/color indicators as small badges
- **Filters Sidebar:** Left 20% on desktop with category, size, color checkboxes; collapses to drawer on mobile
- **Product Detail:** Image carousel left 50%, details right 50%, size chart as expandable accordion

### About (/about)
- **Timeline Layout:** Vertical timeline with alternating content blocks showing club history
- **Stats Section:** 4-column grid with large numbers (members, cities, total km run)
- **Join CTA:** Prominent card with yellow background, centered

### Admin (/admin)
- **Dashboard:** Tab navigation for sections (Events, Photos, Products, Orders)
- **Data Tables:** Striped rows, action buttons (edit/delete) in right column
- **Forms:** Two-column layouts for create/edit, clear section divisions
- **Moderation Queue:** Photo grid with approve/reject buttons overlaid on hover

## Component Library

### Cards
- **Event Card:** Rounded corners `rounded-xl`, shadow `shadow-md`, padding `p-6`, hover lift `hover:-translate-y-1 transition-transform`
- **Product Card:** Clean borders, minimal shadow, emphasis on product image
- **Photo Card:** No padding, image fills card, metadata on dark overlay at bottom

### Buttons
- **Primary:** Yellow background, black text, `px-6 py-3 rounded-lg font-semibold`
- **Secondary:** Turquoise or outlined black, same padding
- **On Images:** Always with `backdrop-blur-md bg-white/10` for visibility

### Badges
- **Status:** Small pills `px-3 py-1 rounded-full text-xs font-medium`
- **Tags:** Outlined style, turquoise border

### Forms
- **Inputs:** Border `border-2`, focus ring in yellow, rounded `rounded-lg`, padding `px-4 py-3`
- **Validation:** Error messages in red below field, success in green

### Navigation
- **Header:** Sticky top, white background with subtle shadow, logo left, nav links center, auth buttons right
- **Footer:** Dark background (black), yellow accents, 4-column grid on desktop

## Images

### Required Images:
1. **Homepage Hero:** Dynamic group running shot, urban setting, diverse participants (1920x1080 minimum)
2. **Event Covers:** Each event needs landscape cover (1200x600), showing route/location context
3. **About Section:** Community gathering photo (800x600)
4. **Gallery:** 12-15 authentic run photos showing variety of conditions/locations
5. **Product Images:** Clean white background, multiple angles per product (800x800)

### Image Treatment:
- Subtle overlays on hero images for text legibility
- Lazy loading for gallery
- Next.js Image optimization throughout

## Animations
**Minimal, Purposeful:**
- Card hover lifts: `hover:-translate-y-1`
- Photo lightbox: Fade in/out
- Page transitions: None (fast navigation preferred)
- Loading states: Simple spinners, no elaborate animations

## Accessibility
- All images have descriptive alt text
- Focus indicators on all interactive elements (yellow ring)
- Semantic HTML throughout
- Form labels properly associated
- Keyboard navigation for galleries and lightboxes

This design creates an energetic, community-focused experience that honors Mikkeller's bold brand while prioritizing usability for event management, photo sharing, and merchandise sales.