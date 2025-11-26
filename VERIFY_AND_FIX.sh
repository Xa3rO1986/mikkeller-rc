#!/bin/bash

# On your CapRover server, run these commands ONE AT A TIME

echo "=== STEP 1: Check if tables exist ==="
sudo docker exec srv-captain--mikkeller-db.1.joxp4x0ewicb1zvw9khzj9lxy psql -U mikkeller_user -d mikkeller_rc -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' LIMIT 5;"

echo ""
echo "=== If you see 0 rows above, tables don't exist yet ==="
echo ""
echo "=== STEP 2: Create all tables with this command ==="
echo ""
echo "Copy and paste the entire block below:"
echo ""

cat << 'SQLEOF'
sudo docker exec srv-captain--mikkeller-db.1.joxp4x0ewicb1zvw9khzj9lxy psql -U mikkeller_user -d mikkeller_rc << 'EOF'
CREATE TYPE "public"."event_status" AS ENUM('draft', 'published', 'archived');
CREATE TYPE "public"."event_type" AS ENUM('club', 'irregular', 'out_of_town', 'city', 'athletics', 'croissant');
CREATE TYPE "public"."news_status" AS ENUM('draft', 'published');
CREATE TYPE "public"."order_status" AS ENUM('created', 'paid', 'failed');
CREATE TYPE "public"."photo_status" AS ENUM('pending', 'approved', 'rejected');
CREATE TABLE "home_settings" ("id" varchar PRIMARY KEY DEFAULT 'singleton' NOT NULL, "hero_image_url" text, "hero_title" text DEFAULT 'Mikkeller Running Club' NOT NULL, "hero_subtitle" text DEFAULT 'Мы бегаем. Мы пьём пиво. Мы друзья.' NOT NULL, "about_title" text DEFAULT 'О клубе' NOT NULL, "about_text_1" text DEFAULT 'Mikkeller Running Club — это международное сообщество бегунов, которые встречаются каждую неделю, чтобы вместе бегать и наслаждаться компанией друг друга.' NOT NULL, "about_text_2" text DEFAULT 'Мы бегаем в более чем 50 городах по всему миру. Наши забеги подходят для всех уровней подготовки — от новичков до опытных марафонцев.' NOT NULL, "stats_participants" text DEFAULT '1200+' NOT NULL, "stats_cities" text DEFAULT '50+' NOT NULL, "stats_runs" text DEFAULT '500+' NOT NULL, "stats_kilometers" text DEFAULT '15K' NOT NULL, "updated_at" timestamp DEFAULT now() NOT NULL);
CREATE TABLE "about_settings" ("id" varchar PRIMARY KEY DEFAULT 'singleton' NOT NULL, "hero_title" text DEFAULT 'О Mikkeller Running Club' NOT NULL, "hero_image_url" text, "hero_text_1" text DEFAULT 'Mikkeller Running Club — это международное беговое сообщество, основанное в 2014 году в Копенгагене.' NOT NULL, "hero_text_2" text DEFAULT 'Каждую неделю тысячи бегунов по всему миру выходят на улицы своих городов, чтобы пробежать вместе 5-10 километров.' NOT NULL, "hero_text_3" text DEFAULT 'В Москве клуб работает с 2016 года и объединяет более 1200 активных участников.' NOT NULL, "updated_at" timestamp DEFAULT now() NOT NULL);
CREATE TABLE "page_settings" ("id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "page_key" varchar NOT NULL UNIQUE, "title" text NOT NULL, "description" text NOT NULL, "keywords" text, "og_title" text, "og_description" text, "og_image_url" text, "updated_at" timestamp DEFAULT now() NOT NULL);
CREATE TABLE "admins" ("id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "username" varchar NOT NULL UNIQUE, "password_hash" text NOT NULL, "email" varchar, "first_name" varchar, "last_name" varchar, "created_at" timestamp DEFAULT now() NOT NULL);
CREATE TABLE "locations" ("id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "slug" text NOT NULL UNIQUE, "name" text NOT NULL, "description" text, "address" text NOT NULL, "latitude" real NOT NULL, "longitude" real NOT NULL, "logo_url" text, "created_at" timestamp DEFAULT now() NOT NULL);
CREATE TABLE "events" ("id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "slug" text NOT NULL UNIQUE, "title" text NOT NULL, "description" text NOT NULL, "starts_at" timestamp NOT NULL, "ends_at" timestamp, "event_type" "event_type" DEFAULT 'club', "location_id" varchar, "latitude" real, "longitude" real, "address" text, "distance_km" real, "gpx_url" text, "polyline" text, "cover_image_url" text, "status" "event_status" DEFAULT 'draft' NOT NULL, "tags" text[] DEFAULT '{}'::text[] NOT NULL, "created_at" timestamp DEFAULT now() NOT NULL);
CREATE TABLE "event_routes" ("id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "event_id" varchar NOT NULL, "name" text, "distance_km" real NOT NULL, "gpx_url" text, "order" integer DEFAULT 0 NOT NULL, "created_at" timestamp DEFAULT now() NOT NULL);
CREATE TABLE "photos" ("id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "event_id" varchar, "admin_id" varchar, "title" text, "description" text, "url" text NOT NULL, "thumb_url" text NOT NULL, "status" "photo_status" DEFAULT 'pending' NOT NULL, "created_at" timestamp DEFAULT now() NOT NULL);
CREATE TABLE "products" ("id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "slug" text NOT NULL UNIQUE, "title" text NOT NULL, "description" text NOT NULL, "images" text[] DEFAULT '{}'::text[] NOT NULL, "category" text NOT NULL, "base_price" integer, "active" boolean DEFAULT true NOT NULL, "created_at" timestamp DEFAULT now() NOT NULL);
CREATE TABLE "variants" ("id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "product_id" varchar NOT NULL, "size" text, "color" text, "sku" text NOT NULL UNIQUE, "stock" integer DEFAULT 0 NOT NULL, "price" integer NOT NULL);
CREATE TABLE "orders" ("id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "items" jsonb NOT NULL, "amount_total" integer NOT NULL, "currency" text DEFAULT 'RUB' NOT NULL, "status" "order_status" DEFAULT 'created' NOT NULL, "email" text NOT NULL, "shipping_address" jsonb, "yookassa_payment_id" text UNIQUE, "created_at" timestamp DEFAULT now() NOT NULL);
CREATE TABLE "news" ("id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "slug" text NOT NULL UNIQUE, "title" text NOT NULL, "excerpt" text NOT NULL, "content" text NOT NULL, "cover_image_url" text, "published_at" timestamp, "status" "news_status" DEFAULT 'draft' NOT NULL, "created_at" timestamp DEFAULT now() NOT NULL, "updated_at" timestamp DEFAULT now() NOT NULL);
CREATE TABLE "sessions" ("sid" varchar PRIMARY KEY NOT NULL, "sess" jsonb NOT NULL, "expire" timestamp NOT NULL);
CREATE TABLE "strava_accounts" ("id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "user_id" varchar NOT NULL UNIQUE, "strava_id" bigint NOT NULL UNIQUE, "access_token" text NOT NULL, "refresh_token" text NOT NULL, "expires_at" bigint NOT NULL, "first_name" text, "last_name" text, "profile_picture" text, "created_at" timestamp DEFAULT now() NOT NULL, "updated_at" timestamp DEFAULT now() NOT NULL);
CREATE TABLE "activities" ("id" bigint PRIMARY KEY NOT NULL, "user_id" varchar NOT NULL, "name" text NOT NULL, "distance" real NOT NULL, "moving_time" integer NOT NULL, "sport_type" text NOT NULL, "polyline" text, "start_date" timestamp NOT NULL, "created_at" timestamp DEFAULT now() NOT NULL, "updated_at" timestamp DEFAULT now() NOT NULL);
ALTER TABLE "event_routes" ADD CONSTRAINT "event_routes_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE cascade;
ALTER TABLE "events" ADD CONSTRAINT "events_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE set null;
ALTER TABLE "photos" ADD CONSTRAINT "photos_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE set null;
ALTER TABLE "photos" ADD CONSTRAINT "photos_admin_id_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE cascade;
ALTER TABLE "variants" ADD CONSTRAINT "variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade;
CREATE INDEX "activities_user_id_idx" ON "activities" ("user_id");
CREATE INDEX "activities_start_date_idx" ON "activities" ("start_date");
CREATE INDEX "IDX_session_expire" ON "sessions" ("expire");
CREATE INDEX "strava_accounts_strava_id_idx" ON "strava_accounts" ("strava_id");
CREATE INDEX "strava_accounts_user_id_idx" ON "strava_accounts" ("user_id");
EOF
SQLEOF

echo ""
echo "=== STEP 3: After tables are created, restart the service ==="
echo "sudo docker service update --force srv-captain--mikkeller-rc"
echo ""
echo "=== STEP 4: Wait 30 seconds, then check logs ==="
echo "sudo docker service logs srv-captain--mikkeller-rc 2>&1 | tail -10"
