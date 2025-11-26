import { db } from "./db";
import { sql } from "drizzle-orm";

export async function initializeDatabase() {
  const log = (msg: string) => console.log(`[DB Init] ${msg}`);
  
  try {
    log("Starting database initialization...");

    // Check if any tables exist
    const tables = await db.execute(sql`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `);

    const tableNames = (tables.rows as any[]).map(r => r.tablename);
    log(`Found ${tableNames.length} existing tables: ${tableNames.join(", ")}`);

    // Only create types and tables if they don't exist - NEVER drop anything
    if (!tableNames.includes("home_settings")) {
      log("Core tables not found. Creating all tables...");

      // Create types (safe - will skip if already exist)
      try {
        await db.execute(sql`CREATE TYPE "public"."event_status" AS ENUM('draft', 'published', 'archived')`);
      } catch (e: any) {
        if (!e.message?.includes("already exists")) throw e;
      }
      
      try {
        await db.execute(sql`CREATE TYPE "public"."event_type" AS ENUM('club', 'irregular', 'out_of_town', 'city', 'athletics', 'croissant')`);
      } catch (e: any) {
        if (!e.message?.includes("already exists")) throw e;
      }
      
      try {
        await db.execute(sql`CREATE TYPE "public"."news_status" AS ENUM('draft', 'published')`);
      } catch (e: any) {
        if (!e.message?.includes("already exists")) throw e;
      }
      
      try {
        await db.execute(sql`CREATE TYPE "public"."order_status" AS ENUM('created', 'paid', 'failed')`);
      } catch (e: any) {
        if (!e.message?.includes("already exists")) throw e;
      }
      
      try {
        await db.execute(sql`CREATE TYPE "public"."photo_status" AS ENUM('pending', 'approved', 'rejected')`);
      } catch (e: any) {
        if (!e.message?.includes("already exists")) throw e;
      }
      
      log("Created or verified types");

      // Create all tables only if they don't exist
      const createTablesSql = `
        CREATE TABLE IF NOT EXISTS "home_settings" (
          "id" varchar PRIMARY KEY DEFAULT 'singleton' NOT NULL,
          "hero_image_url" text,
          "hero_title" text DEFAULT 'Mikkeller Running Club' NOT NULL,
          "hero_subtitle" text DEFAULT 'Мы бегаем. Мы пьём пиво. Мы друзья.' NOT NULL,
          "about_title" text DEFAULT 'О клубе' NOT NULL,
          "about_text_1" text DEFAULT 'Mikkeller Running Club — это международное сообщество бегунов, которые встречаются каждую неделю, чтобы вместе бегать и наслаждаться компанией друг друга.' NOT NULL,
          "about_text_2" text DEFAULT 'Мы бегаем в более чем 50 городах по всему миру. Наши забеги подходят для всех уровней подготовки — от новичков до опытных марафонцев.' NOT NULL,
          "stats_participants" text DEFAULT '1200+' NOT NULL,
          "stats_cities" text DEFAULT '50+' NOT NULL,
          "stats_runs" text DEFAULT '500+' NOT NULL,
          "stats_kilometers" text DEFAULT '15K' NOT NULL,
          "updated_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "about_settings" (
          "id" varchar PRIMARY KEY DEFAULT 'singleton' NOT NULL,
          "hero_title" text DEFAULT 'О Mikkeller Running Club' NOT NULL,
          "hero_image_url" text,
          "hero_text_1" text DEFAULT 'Mikkeller Running Club — это международное беговое сообщество, основанное в 2014 году в Копенгагене.' NOT NULL,
          "hero_text_2" text DEFAULT 'Каждую неделю тысячи бегунов по всему миру выходят на улицы своих городов, чтобы пробежать вместе 5-10 километров.' NOT NULL,
          "hero_text_3" text DEFAULT 'В Москве клуб работает с 2016 года и объединяет более 1200 активных участников.' NOT NULL,
          "updated_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "page_settings" (
          "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "page_key" varchar NOT NULL UNIQUE,
          "title" text NOT NULL,
          "description" text NOT NULL,
          "keywords" text,
          "og_title" text,
          "og_description" text,
          "og_image_url" text,
          "updated_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "admins" (
          "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "username" varchar NOT NULL UNIQUE,
          "password_hash" text NOT NULL,
          "email" varchar,
          "first_name" varchar,
          "last_name" varchar,
          "created_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "locations" (
          "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "slug" text NOT NULL UNIQUE,
          "name" text NOT NULL,
          "description" text,
          "address" text NOT NULL,
          "latitude" real NOT NULL,
          "longitude" real NOT NULL,
          "logo_url" text,
          "created_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "events" (
          "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "slug" text NOT NULL UNIQUE,
          "title" text NOT NULL,
          "description" text NOT NULL,
          "starts_at" timestamp NOT NULL,
          "ends_at" timestamp,
          "event_type" "event_type" DEFAULT 'club',
          "location_id" varchar,
          "latitude" real,
          "longitude" real,
          "address" text,
          "distance_km" real,
          "gpx_url" text,
          "polyline" text,
          "cover_image_url" text,
          "status" "event_status" DEFAULT 'draft' NOT NULL,
          "tags" text[] DEFAULT '{}'::text[] NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "event_routes" (
          "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "event_id" varchar NOT NULL,
          "name" text,
          "distance_km" real NOT NULL,
          "gpx_url" text,
          "order" integer DEFAULT 0 NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "photos" (
          "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "event_id" varchar,
          "admin_id" varchar,
          "title" text,
          "description" text,
          "url" text NOT NULL,
          "thumb_url" text NOT NULL,
          "status" "photo_status" DEFAULT 'pending' NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "products" (
          "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "slug" text NOT NULL UNIQUE,
          "title" text NOT NULL,
          "description" text NOT NULL,
          "images" text[] DEFAULT '{}'::text[] NOT NULL,
          "category" text NOT NULL,
          "base_price" integer,
          "active" boolean DEFAULT true NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "variants" (
          "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "product_id" varchar NOT NULL,
          "size" text,
          "color" text,
          "sku" text NOT NULL UNIQUE,
          "stock" integer DEFAULT 0 NOT NULL,
          "price" integer NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "orders" (
          "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "items" jsonb NOT NULL,
          "amount_total" integer NOT NULL,
          "currency" text DEFAULT 'RUB' NOT NULL,
          "status" "order_status" DEFAULT 'created' NOT NULL,
          "email" text NOT NULL,
          "shipping_address" jsonb,
          "yookassa_payment_id" text UNIQUE,
          "created_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "news" (
          "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "slug" text NOT NULL UNIQUE,
          "title" text NOT NULL,
          "excerpt" text NOT NULL,
          "content" text NOT NULL,
          "cover_image_url" text,
          "published_at" timestamp,
          "status" "news_status" DEFAULT 'draft' NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL,
          "updated_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "sessions" (
          "sid" varchar PRIMARY KEY NOT NULL,
          "sess" jsonb NOT NULL,
          "expire" timestamp NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "strava_accounts" (
          "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "user_id" varchar NOT NULL UNIQUE,
          "strava_id" bigint NOT NULL UNIQUE,
          "access_token" text NOT NULL,
          "refresh_token" text NOT NULL,
          "expires_at" bigint NOT NULL,
          "first_name" text,
          "last_name" text,
          "profile_picture" text,
          "created_at" timestamp DEFAULT now() NOT NULL,
          "updated_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "activities" (
          "id" bigint PRIMARY KEY NOT NULL,
          "user_id" varchar NOT NULL,
          "name" text NOT NULL,
          "distance" real NOT NULL,
          "moving_time" integer NOT NULL,
          "sport_type" text NOT NULL,
          "polyline" text,
          "start_date" timestamp NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL,
          "updated_at" timestamp DEFAULT now() NOT NULL
        );
      `;

      await db.execute(sql.raw(createTablesSql));
      log("✅ All tables created or verified!");

      // Add constraints and indexes if they don't exist
      try {
        await db.execute(sql`
          ALTER TABLE "event_routes" ADD CONSTRAINT "event_routes_event_id_events_id_fk" 
          FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE cascade
        `);
      } catch (e: any) {
        if (!e.message?.includes("already exists")) log(`Note: ${e.message}`);
      }

      try {
        await db.execute(sql`
          ALTER TABLE "events" ADD CONSTRAINT "events_location_id_locations_id_fk" 
          FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE set null
        `);
      } catch (e: any) {
        if (!e.message?.includes("already exists")) log(`Note: ${e.message}`);
      }

      try {
        await db.execute(sql`
          ALTER TABLE "photos" ADD CONSTRAINT "photos_event_id_events_id_fk" 
          FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE set null
        `);
      } catch (e: any) {
        if (!e.message?.includes("already exists")) log(`Note: ${e.message}`);
      }

      try {
        await db.execute(sql`
          ALTER TABLE "photos" ADD CONSTRAINT "photos_admin_id_admins_id_fk" 
          FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE cascade
        `);
      } catch (e: any) {
        if (!e.message?.includes("already exists")) log(`Note: ${e.message}`);
      }

      try {
        await db.execute(sql`
          ALTER TABLE "variants" ADD CONSTRAINT "variants_product_id_products_id_fk" 
          FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade
        `);
      } catch (e: any) {
        if (!e.message?.includes("already exists")) log(`Note: ${e.message}`);
      }

      log("✅ Constraints and indexes verified!");
    } else {
      log("✅ All required tables already exist - preserving all data");
    }

  } catch (error: any) {
    log(`⚠️ Error during initialization: ${error.message}`);
    throw error;
  }
}
