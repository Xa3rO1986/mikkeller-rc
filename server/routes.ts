import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertEventSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware from Replit Auth blueprint
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Events routes
  app.get('/api/events', async (req, res) => {
    try {
      const { status, upcoming } = req.query;
      const events = await storage.getEvents({
        status: status as string,
        upcoming: upcoming === 'true',
      });
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get('/api/events/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const event = await storage.getEventBySlug(slug);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  // Protected routes for admin/editor
  const isAdminOrEditor: typeof isAuthenticated = async (req, res, next) => {
    await isAuthenticated(req, res, async () => {
      const userId = (req.user as any).claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    });
  };

  app.post('/api/events', isAdminOrEditor, async (req, res) => {
    try {
      const validationResult = insertEventSchema.safeParse(req.body);
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          message: "Validation error", 
          error: validationError.toString() 
        });
      }
      const event = await storage.createEvent(validationResult.data);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.patch('/api/events/:id', isAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const validationResult = insertEventSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          message: "Validation error", 
          error: validationError.toString() 
        });
      }
      const event = await storage.updateEvent(id, validationResult.data);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete('/api/events/:id', isAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteEvent(id);
      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Products routes
  app.get('/api/products', async (req, res) => {
    try {
      const { category, active } = req.query;
      const filters: { category?: string; active?: boolean } = {};
      
      if (typeof category === 'string') {
        filters.category = category;
      }
      if (typeof active === 'string') {
        filters.active = active === 'true';
      }
      
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const product = await storage.getProductBySlug(slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
