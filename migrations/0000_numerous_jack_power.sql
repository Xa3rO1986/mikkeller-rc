CREATE TYPE "public"."event_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('club', 'irregular', 'out_of_town', 'city', 'athletics', 'croissant');--> statement-breakpoint
CREATE TYPE "public"."news_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('created', 'paid', 'failed');--> statement-breakpoint
CREATE TYPE "public"."photo_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "about_settings" (
	"id" varchar PRIMARY KEY DEFAULT 'singleton' NOT NULL,
	"hero_title" text DEFAULT 'О Mikkeller Running Club' NOT NULL,
	"hero_image_url" text,
	"hero_text_1" text DEFAULT 'Mikkeller Running Club — это международное беговое сообщество, основанное в 2014 году в Копенгагене. Наша философия проста: бег должен быть доступен всем, независимо от уровня подготовки.' NOT NULL,
	"hero_text_2" text DEFAULT 'Каждую неделю тысячи бегунов по всему миру выходят на улицы своих городов, чтобы пробежать вместе 5-10 километров. После забега мы собираемся вместе, чтобы отметить достижения и насладиться компанией друг друга.' NOT NULL,
	"hero_text_3" text DEFAULT 'В Москве клуб работает с 2016 года и объединяет более 1200 активных участников. Мы проводим еженедельные забеги в разных локациях города.' NOT NULL,
	"stats_members" text DEFAULT '1,200+' NOT NULL,
	"stats_members_label" text DEFAULT 'Участников в Москве' NOT NULL,
	"stats_bars" text DEFAULT '25+' NOT NULL,
	"stats_bars_label" text DEFAULT 'Баров-партнеров' NOT NULL,
	"stats_runs" text DEFAULT '500+' NOT NULL,
	"stats_runs_label" text DEFAULT 'Проведено забегов' NOT NULL,
	"stats_distance" text DEFAULT '15,000' NOT NULL,
	"stats_distance_label" text DEFAULT 'Километров пробежано' NOT NULL,
	"rule_1_title" text DEFAULT 'Все уровни приветствуются' NOT NULL,
	"rule_1_text" text DEFAULT 'Не важно, новичок вы или опытный бегун — каждый найдёт свой темп и группу единомышленников.' NOT NULL,
	"rule_2_title" text DEFAULT 'Никто не остаётся позади' NOT NULL,
	"rule_2_text" text DEFAULT 'Мы всегда бежим вместе. У нас есть группы разного темпа, чтобы всем было комфортно.' NOT NULL,
	"rule_3_title" text DEFAULT 'Безопасность превыше всего' NOT NULL,
	"rule_3_text" text DEFAULT 'Следуйте правилам дорожного движения, бегайте по правой стороне дороги, используйте светоотражающие элементы.' NOT NULL,
	"rule_4_title" text DEFAULT 'Уважение к другим' NOT NULL,
	"rule_4_text" text DEFAULT 'Мы уважаем всех участников, пешеходов и других пользователей дорог. Будьте вежливы и дружелюбны.' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activities" (
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
--> statement-breakpoint
CREATE TABLE "admins" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar NOT NULL,
	"password_hash" text NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "event_routes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" varchar NOT NULL,
	"name" text,
	"distance_km" real NOT NULL,
	"gpx_url" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
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
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "home_settings" (
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
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"address" text NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"logo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "locations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"cover_image_url" text,
	"published_at" timestamp,
	"status" "news_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "news_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"items" jsonb NOT NULL,
	"amount_total" integer NOT NULL,
	"currency" text DEFAULT 'RUB' NOT NULL,
	"status" "order_status" DEFAULT 'created' NOT NULL,
	"email" text NOT NULL,
	"shipping_address" jsonb,
	"yookassa_payment_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_yookassa_payment_id_unique" UNIQUE("yookassa_payment_id")
);
--> statement-breakpoint
CREATE TABLE "page_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_key" varchar NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"keywords" text,
	"og_title" text,
	"og_description" text,
	"og_image_url" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "page_settings_page_key_unique" UNIQUE("page_key")
);
--> statement-breakpoint
CREATE TABLE "photos" (
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
--> statement-breakpoint
CREATE TABLE "products" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"images" text[] DEFAULT '{}'::text[] NOT NULL,
	"category" text NOT NULL,
	"base_price" integer,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "strava_accounts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"strava_id" bigint NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_at" bigint NOT NULL,
	"first_name" text,
	"last_name" text,
	"profile_picture" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "strava_accounts_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "strava_accounts_strava_id_unique" UNIQUE("strava_id")
);
--> statement-breakpoint
CREATE TABLE "variants" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" varchar NOT NULL,
	"size" text,
	"color" text,
	"sku" text NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"price" integer NOT NULL,
	CONSTRAINT "variants_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
ALTER TABLE "event_routes" ADD CONSTRAINT "event_routes_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_admin_id_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activities_user_id_idx" ON "activities" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "activities_start_date_idx" ON "activities" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "activities_sport_type_idx" ON "activities" USING btree ("sport_type");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
CREATE INDEX "strava_accounts_strava_id_idx" ON "strava_accounts" USING btree ("strava_id");--> statement-breakpoint
CREATE INDEX "strava_accounts_user_id_idx" ON "strava_accounts" USING btree ("user_id");