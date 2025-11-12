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
import Stripe from "stripe";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Stripe (will be undefined if keys are not set)
let stripe: Stripe | undefined;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-11-20.acacia",
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware from Replit Auth blueprint
  await setupAuth(app);
  
  // Serve uploaded photos
  app.use('/uploads/photos', express.static(path.join(__dirname, 'uploads', 'photos')));

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

  // Stripe Checkout routes
  app.post('/api/checkout', isAuthenticated, async (req: any, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ 
          message: "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable." 
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

      const lineItems = await Promise.all(
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

          return {
            price_data: {
              currency: 'rub',
              product_data: {
                name: `${product.title}${variantTitle}`,
                description: product.description,
                images: product.images.slice(0, 1),
              },
              unit_amount: price,
            },
            quantity: item.quantity,
          };
        })
      );

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.headers.origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/shop`,
        customer_email: user.email || undefined,
        metadata: {
          userId: user.id,
          cartItems: JSON.stringify(items.map((item: any, index: number) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            price: lineItems[index].price_data.unit_amount,
          }))),
        },
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Failed to create checkout session", error: error.message });
    }
  });

  app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Stripe is not configured" });
      }

      const sig = req.headers['stripe-signature'];
      if (!sig || typeof sig !== 'string') {
        return res.status(400).json({ message: "Missing stripe-signature header" });
      }

      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        console.warn("STRIPE_WEBHOOK_SECRET not set, skipping signature verification");
        return res.status(400).json({ message: "Webhook secret not configured" });
      }

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).json({ message: `Webhook Error: ${err.message}` });
      }

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.userId;
          const cartItemsStr = session.metadata?.cartItems;
          
          if (userId && cartItemsStr) {
            try {
              const existingOrder = await storage.getOrderByStripeSessionId(session.id);
              if (existingOrder) {
                await storage.updateOrder(existingOrder.id, {
                  status: session.payment_status === 'paid' ? 'paid' : 'created',
                  stripePaymentIntentId: session.payment_intent as string || undefined,
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

              const order = await storage.createOrder({
                userId,
                stripeSessionId: session.id,
                stripePaymentIntentId: session.payment_intent as string || undefined,
                status: session.payment_status === 'paid' ? 'paid' : 'created',
                items: items as any,
                amountTotal: session.amount_total || 0,
                currency: (session.currency || 'rub').toUpperCase(),
                email: session.customer_details?.email || session.customer_email || '',
                shippingAddress: session.customer_details?.address ? {
                  line1: session.customer_details.address.line1,
                  line2: session.customer_details.address.line2,
                  city: session.customer_details.address.city,
                  state: session.customer_details.address.state,
                  postalCode: session.customer_details.address.postal_code,
                  country: session.customer_details.address.country,
                } : null,
              });
              console.log('Order created:', order.id);
            } catch (error) {
              console.error('Error creating order from webhook:', error);
            }
          }
          break;
        }
        case 'checkout.session.async_payment_succeeded': {
          const session = event.data.object as Stripe.Checkout.Session;
          const order = await storage.getOrderByStripeSessionId(session.id);
          if (order) {
            await storage.updateOrder(order.id, { status: 'paid' });
            console.log('Order marked as paid:', order.id);
          }
          break;
        }
        case 'checkout.session.async_payment_failed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const order = await storage.getOrderByStripeSessionId(session.id);
          if (order) {
            await storage.updateOrder(order.id, { status: 'failed' });
            console.log('Order marked as failed:', order.id);
          }
          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(500).json({ message: "Webhook error", error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
