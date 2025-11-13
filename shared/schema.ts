import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, boolean, integer, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const eventStatusEnum = pgEnum("event_status", ["draft", "published", "archived"]);
export const eventTypeEnum = pgEnum("event_type", ["club", "irregular", "out_of_town", "city", "athletics"]);
export const photoStatusEnum = pgEnum("photo_status", ["pending", "approved", "rejected"]);
export const orderStatusEnum = pgEnum("order_status", ["created", "paid", "failed"]);

// Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Administrators table
export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  email: varchar("email"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

// Locations table
export const locations = pgTable("locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  createdAt: true,
});

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

// Events table
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at"),
  eventType: eventTypeEnum("event_type").default("club"),
  locationId: varchar("location_id").references(() => locations.id, { onDelete: "set null" }),
  latitude: real("latitude"),
  longitude: real("longitude"),
  address: text("address"),
  distanceKm: real("distance_km"),
  gpxUrl: text("gpx_url"),
  polyline: text("polyline"),
  coverImageUrl: text("cover_image_url"),
  status: eventStatusEnum("status").default("draft").notNull(),
  tags: text("tags").array().default(sql`'{}'::text[]`).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
}).extend({
  tags: z.array(z.string()).default([]),
  startsAt: z.string().or(z.date()),
  endsAt: z.string().or(z.date()).optional(),
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Photos table
export const photos = pgTable("photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").references(() => events.id, { onDelete: "set null" }),
  adminId: varchar("admin_id").references(() => admins.id, { onDelete: "cascade" }),
  title: text("title"),
  description: text("description"),
  url: text("url").notNull(),
  thumbUrl: text("thumb_url").notNull(),
  status: photoStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  createdAt: true,
});

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;

// Products table
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  images: text("images").array().default(sql`'{}'::text[]`).notNull(),
  category: text("category").notNull(),
  basePrice: integer("base_price"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
}).merge(z.object({
  basePrice: z.number().min(0).nullable().optional(),
}));

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Variants table
export const variants = pgTable("variants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  size: text("size"),
  color: text("color"),
  sku: text("sku").notNull().unique(),
  stock: integer("stock").default(0).notNull(),
  price: integer("price").notNull(), // in cents/kopecks
});

export const insertVariantSchema = createInsertSchema(variants).omit({
  id: true,
});

export type InsertVariant = z.infer<typeof insertVariantSchema>;
export type Variant = typeof variants.$inferSelect;

// Orders table
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  items: jsonb("items").notNull(),
  amountTotal: integer("amount_total").notNull(),
  currency: text("currency").default("RUB").notNull(),
  status: orderStatusEnum("status").default("created").notNull(),
  email: text("email").notNull(),
  shippingAddress: jsonb("shipping_address"),
  yookassaPaymentId: text("yookassa_payment_id").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Home settings table (singleton)
export const homeSettings = pgTable("home_settings", {
  id: varchar("id").primaryKey().default("singleton"),
  heroImageUrl: text("hero_image_url"),
  heroTitle: text("hero_title").notNull().default("Mikkeller Running Club"),
  heroSubtitle: text("hero_subtitle").notNull().default("Мы бегаем. Мы пьём пиво. Мы друзья."),
  aboutTitle: text("about_title").notNull().default("О клубе"),
  aboutText1: text("about_text_1").notNull().default("Mikkeller Running Club — это международное сообщество бегунов, которые встречаются каждую неделю, чтобы вместе бегать и наслаждаться компанией друг друга."),
  aboutText2: text("about_text_2").notNull().default("Мы бегаем в более чем 50 городах по всему миру. Наши забеги подходят для всех уровней подготовки — от новичков до опытных марафонцев."),
  statsParticipants: text("stats_participants").notNull().default("1200+"),
  statsCities: text("stats_cities").notNull().default("50+"),
  statsRuns: text("stats_runs").notNull().default("500+"),
  statsKilometers: text("stats_kilometers").notNull().default("15K"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHomeSettingsSchema = createInsertSchema(homeSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertHomeSettings = z.infer<typeof insertHomeSettingsSchema>;
export type HomeSettings = typeof homeSettings.$inferSelect;

// About page settings table (singleton)
export const aboutSettings = pgTable("about_settings", {
  id: varchar("id").primaryKey().default("singleton"),
  heroTitle: text("hero_title").notNull().default("О Mikkeller Running Club"),
  heroImageUrl: text("hero_image_url"),
  heroText1: text("hero_text_1").notNull().default("Mikkeller Running Club — это международное беговое сообщество, основанное в 2014 году в Копенгагене. Наша философия проста: бег должен быть доступен всем, независимо от уровня подготовки."),
  heroText2: text("hero_text_2").notNull().default("Каждую неделю тысячи бегунов по всему миру выходят на улицы своих городов, чтобы пробежать вместе 5-10 километров. После забега мы собираемся вместе, чтобы отметить достижения и насладиться компанией друг друга."),
  heroText3: text("hero_text_3").notNull().default("В Москве клуб работает с 2016 года и объединяет более 1200 активных участников. Мы проводим еженедельные забеги в разных локациях города."),
  statsMembers: text("stats_members").notNull().default("1,200+"),
  statsMembersLabel: text("stats_members_label").notNull().default("Участников в Москве"),
  statsBars: text("stats_bars").notNull().default("25+"),
  statsBarsLabel: text("stats_bars_label").notNull().default("Баров-партнеров"),
  statsRuns: text("stats_runs").notNull().default("500+"),
  statsRunsLabel: text("stats_runs_label").notNull().default("Проведено забегов"),
  statsDistance: text("stats_distance").notNull().default("15,000"),
  statsDistanceLabel: text("stats_distance_label").notNull().default("Километров пробежано"),
  rule1Title: text("rule_1_title").notNull().default("Все уровни приветствуются"),
  rule1Text: text("rule_1_text").notNull().default("Не важно, новичок вы или опытный бегун — каждый найдёт свой темп и группу единомышленников."),
  rule2Title: text("rule_2_title").notNull().default("Никто не остаётся позади"),
  rule2Text: text("rule_2_text").notNull().default("Мы всегда бежим вместе. У нас есть группы разного темпа, чтобы всем было комфортно."),
  rule3Title: text("rule_3_title").notNull().default("Безопасность превыше всего"),
  rule3Text: text("rule_3_text").notNull().default("Следуйте правилам дорожного движения, бегайте по правой стороне дороги, используйте светоотражающие элементы."),
  rule4Title: text("rule_4_title").notNull().default("Уважение к другим"),
  rule4Text: text("rule_4_text").notNull().default("Мы уважаем всех участников, пешеходов и других пользователей дорог. Будьте вежливы и дружелюбны."),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAboutSettingsSchema = createInsertSchema(aboutSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertAboutSettings = z.infer<typeof insertAboutSettingsSchema>;
export type AboutSettings = typeof aboutSettings.$inferSelect;
