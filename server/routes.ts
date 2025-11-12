import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertEventSchema, insertPhotoSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import YooKassa from "yookassa";
import gpxParser from "gpxparser";
import * as fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize YooKassa (will be undefined if keys are not set)
let yooKassa: YooKassa | undefined;
if (process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY) {
  yooKassa = new YooKassa({
    shopId: process.env.YOOKASSA_SHOP_ID,
    secretKey: process.env.YOOKASSA_SECRET_KEY
  });
}

// Configure multer for photo uploads
const photoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, 'uploads', 'photos'));
  },
  filename: (_req, file, cb) => {
    const uniqueId = nanoid();
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueId}${extension}`);
  }
});

const photoUpload = multer({
  storage: photoStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extension = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    
    if (extension && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Configure multer for GPX uploads
const gpxStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, 'uploads', 'gpx'));
  },
  filename: (_req, file, cb) => {
    const uniqueId = nanoid();
    cb(null, `${uniqueId}.gpx`);
  }
});

const gpxUpload = multer({
  storage: gpxStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for GPX files
  },
  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase() === '.gpx';
    const mimeType = file.mimetype === 'application/gpx+xml' || 
                     file.mimetype === 'application/xml' || 
                     file.mimetype === 'text/xml';
    
    if (extension || mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only GPX files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware from Replit Auth blueprint
  await setupAuth(app);
  
  // Serve uploaded files
  app.use('/uploads/photos', express.static(path.join(__dirname, 'uploads', 'photos')));
  app.use('/uploads/gpx', express.static(path.join(__dirname, 'uploads', 'gpx')));

  // Auth routes
  app.get('/api/user', async (req: any, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.json(null);
      }
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.json(null);
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.json(null);
    }
  });

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

  app.post('/api/events/:id/gpx', isAdminOrEditor, gpxUpload.single('gpx'), async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!req.file) {
        return res.status(400).json({ message: "GPX file is required" });
      }

      const event = await storage.getEvent(id);
      if (!event) {
        await fs.unlink(req.file.path);
        return res.status(404).json({ message: "Event not found" });
      }

      const gpxContent = await fs.readFile(req.file.path, 'utf-8');
      const gpx = new gpxParser();
      gpx.parse(gpxContent);

      if (!gpx.tracks || gpx.tracks.length === 0) {
        await fs.unlink(req.file.path);
        return res.status(400).json({ message: "Invalid GPX file: no tracks found" });
      }

      const track = gpx.tracks[0];
      const distanceMeters = track.distance.total;
      const elevationGainMeters = track.elevation.pos;

      const gpxUrl = `/uploads/gpx/${path.basename(req.file.path)}`;

      const updatedEvent = await storage.updateEvent(id, {
        gpxUrl,
        distanceKm: Math.round(distanceMeters) / 1000,
        elevationGain: Math.round(elevationGainMeters),
      });

      res.json(updatedEvent);
    } catch (error) {
      console.error("Error uploading GPX file:", error);
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      res.status(500).json({ message: "Failed to upload GPX file" });
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

  // Photos routes
  app.get('/api/photos', async (req, res) => {
    try {
      const { eventId, status } = req.query;
      const filters: { eventId?: string; status?: string } = {};
      
      if (typeof eventId === 'string') {
        filters.eventId = eventId;
      }
      if (typeof status === 'string') {
        filters.status = status;
      }
      
      const photos = await storage.getPhotos(filters);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching photos:", error);
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  app.post('/api/photos', isAuthenticated, photoUpload.single('photo'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No photo file provided" });
      }

      const userId = req.user.claims.sub;
      const photoUrl = `/uploads/photos/${req.file.filename}`;
      
      const photoData = {
        userId,
        eventId: req.body.eventId || null,
        title: req.body.title || null,
        description: req.body.description || null,
        url: photoUrl,
        thumbUrl: photoUrl,
        status: 'pending' as const,
      };

      const validationResult = insertPhotoSchema.safeParse(photoData);
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          message: "Validation error", 
          error: validationError.toString() 
        });
      }

      const photo = await storage.createPhoto(validationResult.data);
      res.status(201).json(photo);
    } catch (error) {
      console.error("Error uploading photo:", error);
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: "File too large (max 10MB)" });
        }
      }
      res.status(500).json({ message: "Failed to upload photo" });
    }
  });

  // YooKassa Checkout routes
  app.post('/api/checkout', isAuthenticated, async (req: any, res) => {
    try {
      if (!yooKassa) {
        return res.status(503).json({ 
          message: "YooKassa is not configured. Please set YOOKASSA_SHOP_ID and YOOKASSA_SECRET_KEY environment variables." 
        });
      }

      const { items } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Items are required" });
      }

      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Calculate total amount and prepare cart items
      let totalAmount = 0;
      const cartItems = await Promise.all(
        items.map(async (item: { productId: string; variantId?: string; quantity: number }) => {
          const product = await storage.getProduct(item.productId);
          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }

          const variants = await storage.getVariantsByProduct(product.id);
          let price: number | null = null;
          let variantTitle = '';
          
          if (item.variantId) {
            const variant = variants.find((v) => v.id === item.variantId);
            if (variant && variant.price !== null) {
              price = variant.price;
              variantTitle = ` - ${variant.title}`;
            }
          }
          
          if (price === null) {
            price = product.basePrice || null;
          }
          
          if (price === null) {
            throw new Error(`No price found for product ${product.id}`);
          }

          const itemTotal = price * item.quantity;
          totalAmount += itemTotal;

          return {
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            price: price,
            name: `${product.title}${variantTitle}`,
          };
        })
      );

      // Create YooKassa payment
      const idempotenceKey = nanoid();
      const payment = await yooKassa.createPayment({
        amount: {
          value: (totalAmount / 100).toFixed(2), // Convert kopecks to rubles
          currency: "RUB"
        },
        confirmation: {
          type: "redirect",
          return_url: `${req.headers.origin}/shop/success`
        },
        description: `Заказ на сумму ${(totalAmount / 100).toFixed(2)} ₽`,
        metadata: {
          userId: user.id,
          userEmail: user.email || '',
          cartItems: JSON.stringify(cartItems),
        },
        capture: true, // Auto-capture payment
      }, idempotenceKey);

      res.json({ 
        paymentId: payment.id, 
        url: payment.confirmation.confirmation_url,
        status: payment.status
      });
    } catch (error: any) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Failed to create payment", error: error.message });
    }
  });

  // YooKassa webhook endpoint
  app.post('/api/yookassa/webhook', express.json(), async (req, res) => {
    try {
      console.log('Received YooKassa webhook:', req.body);

      const notification = req.body;
      
      if (!notification || !notification.event || !notification.object) {
        return res.status(400).json({ message: "Invalid webhook payload" });
      }

      const payment = notification.object;
      
      switch (notification.event) {
        case 'payment.succeeded': {
          const userId = payment.metadata?.userId;
          const cartItemsStr = payment.metadata?.cartItems;
          
          if (userId && cartItemsStr) {
            try {
              // Check if order already exists
              const existingOrder = await storage.getOrderByYookassaPaymentId(payment.id);
              if (existingOrder) {
                await storage.updateOrder(existingOrder.id, {
                  status: 'paid',
                });
                console.log('Order updated:', existingOrder.id);
                break;
              }

              const cartItems = JSON.parse(cartItemsStr);
              const items = await Promise.all(cartItems.map(async (item: any) => {
                const product = await storage.getProduct(item.productId);
                let name = product?.title || 'Unknown Product';
                
                if (item.variantId) {
                  const variant = await storage.getVariant(item.variantId);
                  if (variant) {
                    name += ` - ${variant.title}`;
                  }
                }

                return {
                  productId: item.productId,
                  variantId: item.variantId,
                  name,
                  quantity: item.quantity,
                  unitAmount: item.price,
                  totalAmount: item.price * item.quantity,
                };
              }));

              // Convert amount from rubles to kopecks
              const amountInKopecks = Math.round(parseFloat(payment.amount.value) * 100);

              const order = await storage.createOrder({
                userId,
                yookassaPaymentId: payment.id,
                status: 'paid',
                items: items as any,
                amountTotal: amountInKopecks,
                currency: payment.amount.currency,
                email: payment.metadata?.userEmail || '',
                shippingAddress: null,
              });
              console.log('Order created:', order.id);
            } catch (error) {
              console.error('Error creating order from webhook:', error);
            }
          }
          break;
        }
        case 'payment.canceled': {
          const order = await storage.getOrderByYookassaPaymentId(payment.id);
          if (order) {
            await storage.updateOrder(order.id, { status: 'failed' });
            console.log('Order marked as failed:', order.id);
          }
          break;
        }
        default:
          console.log(`Unhandled event type ${notification.event}`);
      }

      // Always respond with 200 OK to YooKassa
      res.sendStatus(200);
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(500).json({ message: "Webhook error", error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
