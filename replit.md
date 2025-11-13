# Mikkeller Running Club

## Overview

This is a production-ready website for the Mikkeller Running Club, a running community that combines weekly runs with social gatherings at partner bars. The application features event management with location catalog, photo galleries, an e-commerce shop for merchandise, and a comprehensive admin panel with editable page content. The design follows a strict minimalist monochrome aesthetic inspired by athletic sportswear brands, using only black and white with careful attention to typography and spacing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool and Wouter for client-side routing

**UI Components**: shadcn/ui component library built on Radix UI primitives, providing accessible, customizable components with consistent styling

**Styling**: Tailwind CSS with a custom monochrome design system defined in CSS variables. The theme uses pure black (#000000) and white (#FFFFFF) with grayscale variations for hierarchy. Typography uses Inter for body/headings and Space Grotesk for accents.

**State Management**: TanStack Query (React Query) for server state management with aggressive caching (staleTime: Infinity). No global client state management library is used.

**Form Handling**: react-hook-form with Zod schema validation for type-safe form validation

**Rich Text Editing**: TipTap WYSIWYG editor for event descriptions with formatting toolbar (bold, italic, headings, lists). HTML output is sanitized server-side before storage.

**Design System**: Follows strict spacing rhythm using Tailwind units (4, 6, 8, 12, 16, 20, 24) with responsive breakpoints. All images use grayscale filter to maintain monochrome aesthetic.

**Admin Dashboard**: Interactive summary cards that switch between management tabs (Settings, Events, Locations, Products, Photos, Orders) on click. Settings tab contains sub-tabs for editing About page and Home page content. Event cover images use react-easy-crop for positioning/cropping to 800x400px during upload. Events support multiple distance routes - admins can add/remove routes, upload GPX files for each route, and set custom names/distances.

**Location Management**: LocationPicker component with Yandex Maps integration for coordinate selection:
- Interactive map for visual location selection via click or marker drag
- Fallback to manual coordinate input if Maps API unavailable
- Graceful error handling for invalid/missing API keys
- Displays latitude/longitude with 6 decimal precision

### Backend Architecture

**Runtime**: Node.js with Express.js server

**API Pattern**: RESTful API with endpoints under `/api/*` prefix

**Authentication**: Session-based authentication using express-session with PostgreSQL session store (connect-pg-simple). Admin users have password hashing via bcrypt.

**File Uploads**: Multer middleware for handling multiple file types with size limits and validation:
- Photo uploads (10MB limit) → `server/uploads/photos` directory
- Cover images (10MB limit) → `server/uploads/covers` directory  
- GPX route files → `server/uploads/gpx` directory

**Route Organization**: Single routes file (`server/routes.ts`) containing all API endpoints for events, photos, products, orders, and admin operations

**Data Access Layer**: Storage abstraction layer (`server/storage.ts`) provides interface-based data access, separating business logic from database operations. Events are filtered as "upcoming" if their start time hasn't passed yet (Moscow timezone UTC+3), transitioning to past events immediately after their scheduled start time.

**Content Security**: HTML sanitization via sanitize-html library on event descriptions to prevent XSS attacks. Allowed tags: p, br, strong, em, b, i, h2, h3, ul, ol, li

### Data Storage

**Database**: PostgreSQL via Neon serverless driver

**ORM**: Drizzle ORM with schema-first approach defined in `shared/schema.ts`

**Schema Design**:
- `admins`: User authentication and admin management
- `locations`: Venue catalog for events with Yandex Maps integration
  - `slug`: URL-friendly identifier
  - `name`: Location name (e.g., "Бар Mikkeller Москва")
  - `address`: Physical address
  - `latitude` / `longitude`: Geographic coordinates for map display
  - `description`: Optional location description
- `events`: Running events with geolocation, cover images, and rich-text descriptions
  - `eventType`: Event type enum (club, irregular, out_of_town, city, athletics, croissant) displayed as Клубный, Внештатный, Выездной, Городской, Атлетикс, Курасан
  - `locationId`: Foreign key reference to locations table (optional)
  - `coverImageUrl`: Cover photo for event display (shown at content width on detail page, not full-screen)
  - `description`: Rich-text HTML content (sanitized server-side)
  - `slug`: URL-friendly identifier for dynamic routing
- `eventRoutes`: Multiple distance routes per event with individual GPX tracks
  - `eventId`: Foreign key to events table (cascade delete)
  - `name`: Optional route name
  - `distanceKm`: Route distance (auto-calculated from GPX or manually entered)
  - `gpxUrl`: GPX track file for route visualization
  - `order`: Sort order for displaying routes (0-indexed)
- `photos`: Event photography with approval workflow (pending/approved/rejected)
- `products` & `variants`: E-commerce product catalog with size/color variations
- `orders`: Order tracking with payment status
- `homeSettings`: Singleton table for Home page editable content (hero title/subtitle, about section, statistics)
- `aboutSettings`: Singleton table for About page editable content (hero text paragraphs, statistics with labels, club rules)
- `sessions`: Express session storage

**Migrations**: Drizzle Kit for schema migrations stored in `/migrations` directory

### Authentication & Authorization

**Session Management**: HTTP-only secure cookies with 7-day TTL, stored in PostgreSQL

**Admin Protection**: Middleware (`isAuthenticated`) protects admin routes, checking session for `adminId`

**Password Security**: bcrypt hashing with salt rounds of 10

**Login Flow**: POST to `/api/admin/login` establishes session, `/api/admin/current` returns current admin or null

### External Dependencies

**Payment Processing**: YooKassa (Russian payment gateway) integration for merchandise checkout with webhook support for payment confirmation

**Map Visualization**: Leaflet.js library installed for future GPX route visualization on public event pages

**GPX Processing**: gpxparser library automatically extracts distance from uploaded GPX files for each route. Admin can create multiple routes per event with different distances and GPX tracks.

**Image Assets**: Static assets stored in `attached_assets/` directory, imported directly into components

**Analytics**: Designed to support Plausible or Vercel Analytics via environment flag (implementation pending)

### Build & Deployment

**Development**: Vite dev server with HMR, custom error overlay, and Replit-specific plugins (cartographer, dev banner)

**Production Build**: 
- Frontend: Vite builds to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js` as ESM
- Single command deployment with `npm run build`

**Environment Variables**:
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SESSION_SECRET`: Session encryption key (required)
- `VITE_YANDEX_MAPS_API_KEY`: Yandex Maps API key for location picker (optional - uses manual coordinate input if not provided)
- `YOOKASSA_SHOP_ID` & `YOOKASSA_SECRET_KEY`: Payment gateway credentials (optional)

### File Organization

**Monorepo Structure**:
- `/client`: Frontend React application
- `/server`: Backend Express server
- `/shared`: Shared TypeScript types and Drizzle schema
- `/migrations`: Database migrations
- `/attached_assets`: Static assets and generated images

**Path Aliases**: TypeScript path mapping configured for `@/*` (client), `@shared/*` (shared), and `@assets/*` (assets)

**Code Sharing**: Database schema and TypeScript types are shared between client and server via `/shared` directory, ensuring type safety across the stack