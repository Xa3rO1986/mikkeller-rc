import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, boolean, integer, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const eventStatusEnum = pgEnum("event_status", ["draft", "published", "archived"]);
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

// Events table
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  address: text("address").notNull(),
  distanceKm: real("distance_km"),
  elevationGain: real("elevation_gain"),
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
  status: photoStatusEnum("status").default("approved").notNull(),
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
});

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
