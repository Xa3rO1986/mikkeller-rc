import { eq, desc, asc, and, sql, gte, lte } from "drizzle-orm";
import { db } from "./db";
import {
  admins,
  events,
  photos,
  products,
  variants,
  orders,
  homeSettings,
  type Admin,
  type InsertAdmin,
  type Event,
  type InsertEvent,
  type Photo,
  type InsertPhoto,
  type Product,
  type InsertProduct,
  type Variant,
  type InsertVariant,
  type Order,
  type InsertOrder,
  type HomeSettings,
  type InsertHomeSettings,
} from "@shared/schema";

export interface IStorage {
  // Admins
  getAdmin(id: string): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  getAdmins(): Promise<Admin[]>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  updateAdmin(id: string, admin: Partial<InsertAdmin>): Promise<Admin | undefined>;
  deleteAdmin(id: string): Promise<boolean>;

  // Events
  getEvents(filters?: { status?: string; upcoming?: boolean }): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  getEventBySlug(slug: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;

  // Photos
  getPhotos(filters?: { eventId?: string; status?: string }): Promise<Photo[]>;
  getPhoto(id: string): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  updatePhoto(id: string, photo: Partial<InsertPhoto>): Promise<Photo | undefined>;
  deletePhoto(id: string): Promise<boolean>;

  // Products
  getProducts(filters?: { category?: string; active?: boolean }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Variants
  getVariantsByProduct(productId: string): Promise<Variant[]>;
  getVariant(id: string): Promise<Variant | undefined>;
  createVariant(variant: InsertVariant): Promise<Variant>;
  updateVariant(id: string, variant: Partial<InsertVariant>): Promise<Variant | undefined>;
  deleteVariant(id: string): Promise<boolean>;

  // Orders
  getOrders(filters?: { userId?: string; status?: string }): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrderByYookassaPaymentId(paymentId: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined>;

  // Home Settings
  getHomeSettings(): Promise<HomeSettings | undefined>;
  updateHomeSettings(settings: Partial<InsertHomeSettings>): Promise<HomeSettings>;
}

export class DatabaseStorage implements IStorage {
  // Admins
  async getAdmin(id: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id)).limit(1);
    return admin;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username)).limit(1);
    return admin;
  }

  async getAdmins(): Promise<Admin[]> {
    return await db.select().from(admins).orderBy(desc(admins.createdAt));
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const [newAdmin] = await db.insert(admins).values(admin).returning();
    return newAdmin;
  }

  async updateAdmin(id: string, admin: Partial<InsertAdmin>): Promise<Admin | undefined> {
    const [updated] = await db.update(admins).set(admin).where(eq(admins.id, id)).returning();
    return updated;
  }

  async deleteAdmin(id: string): Promise<boolean> {
    const result = await db.delete(admins).where(eq(admins.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Events
  async getEvents(filters?: { status?: string; upcoming?: boolean }): Promise<Event[]> {
    let query = db.select().from(events);
    
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(events.status, filters.status as any));
    }
    if (filters?.upcoming) {
      conditions.push(gte(events.startsAt, new Date()));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const result = await query.orderBy(asc(events.startsAt));
    return result;
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return event;
  }

  async getEventBySlug(slug: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updated] = await db.update(events).set(event).where(eq(events.id, id)).returning();
    return updated;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Photos
  async getPhotos(filters?: { eventId?: string; status?: string }): Promise<Photo[]> {
    let query = db.select().from(photos);
    
    const conditions = [];
    if (filters?.eventId) {
      conditions.push(eq(photos.eventId, filters.eventId));
    }
    if (filters?.status) {
      conditions.push(eq(photos.status, filters.status as any));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const result = await query.orderBy(desc(photos.createdAt));
    return result;
  }

  async getPhoto(id: string): Promise<Photo | undefined> {
    const [photo] = await db.select().from(photos).where(eq(photos.id, id)).limit(1);
    return photo;
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const [newPhoto] = await db.insert(photos).values(photo).returning();
    return newPhoto;
  }

  async updatePhoto(id: string, photo: Partial<InsertPhoto>): Promise<Photo | undefined> {
    const [updated] = await db.update(photos).set(photo).where(eq(photos.id, id)).returning();
    return updated;
  }

  async deletePhoto(id: string): Promise<boolean> {
    const result = await db.delete(photos).where(eq(photos.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Products
  async getProducts(filters?: { category?: string; active?: boolean }): Promise<Product[]> {
    let query = db.select().from(products);
    
    const conditions = [];
    if (filters?.category) {
      conditions.push(eq(products.category, filters.category));
    }
    if (filters?.active !== undefined) {
      conditions.push(eq(products.active, filters.active));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const result = await query.orderBy(desc(products.createdAt));
    return result;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Variants
  async getVariantsByProduct(productId: string): Promise<Variant[]> {
    return await db.select().from(variants).where(eq(variants.productId, productId));
  }

  async getVariant(id: string): Promise<Variant | undefined> {
    const [variant] = await db.select().from(variants).where(eq(variants.id, id)).limit(1);
    return variant;
  }

  async createVariant(variant: InsertVariant): Promise<Variant> {
    const [newVariant] = await db.insert(variants).values(variant).returning();
    return newVariant;
  }

  async updateVariant(id: string, variant: Partial<InsertVariant>): Promise<Variant | undefined> {
    const [updated] = await db.update(variants).set(variant).where(eq(variants.id, id)).returning();
    return updated;
  }

  async deleteVariant(id: string): Promise<boolean> {
    const result = await db.delete(variants).where(eq(variants.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Orders
  async getOrders(filters?: { status?: string }): Promise<Order[]> {
    let query = db.select().from(orders);
    
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(orders.status, filters.status as any));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const result = await query.orderBy(desc(orders.createdAt));
    return result;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return order;
  }

  async getOrderByYookassaPaymentId(paymentId: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.yookassaPaymentId, paymentId)).limit(1);
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined> {
    const [updated] = await db.update(orders).set(order).where(eq(orders.id, id)).returning();
    return updated;
  }

  async getHomeSettings(): Promise<HomeSettings | undefined> {
    const [settings] = await db.select().from(homeSettings).where(eq(homeSettings.id, "singleton")).limit(1);
    return settings;
  }

  async updateHomeSettings(settings: Partial<InsertHomeSettings>): Promise<HomeSettings> {
    const existing = await this.getHomeSettings();
    
    if (existing) {
      const [updated] = await db
        .update(homeSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(homeSettings.id, "singleton"))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(homeSettings)
        .values({ id: "singleton", ...settings })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
