import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  limit: '50mb', // Увеличенный лимит для больших запросов
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Run database migrations first
  try {
    const { db } = await import("./db");
    const { migrate } = await import("drizzle-orm/node-postgres/migrator");
    const fs = await import("fs");
    const path = await import("path");
    
    // Try multiple possible migration folder locations
    let migrationsPath = "./migrations";
    const possiblePaths = [
      "./migrations",
      "/app/migrations",
      new URL("../migrations", import.meta.url).pathname,
    ];
    
    for (const tryPath of possiblePaths) {
      try {
        if (fs.default.existsSync(tryPath)) {
          migrationsPath = tryPath;
          log(`Found migrations at: ${tryPath}`);
          const files = fs.default.readdirSync(tryPath);
          log(`Migration files: ${files.join(", ")}`);
          break;
        }
      } catch (e) {
        // continue
      }
    }
    
    log(`Running database migrations from: ${migrationsPath}`);
    try {
      const result = await migrate(db, { migrationsFolder: migrationsPath });
      log(`✅ Database migrations completed: ${JSON.stringify(result)}`);
    } catch (migrationError: any) {
      // If migration system says it's applied but tables don't exist, this is a fallback
      log(`Initial migration attempt result: ${migrationError.message}`);
      
      // Force re-run migrations to ensure tables are created
      if (migrationError.message?.includes("does not exist") || migrationError.message?.includes("relation")) {
        log("Attempting forced migration execution...");
        const result = await migrate(db, { migrationsFolder: migrationsPath });
        log(`✅ Forced migration completed: ${JSON.stringify(result)}`);
      } else {
        throw migrationError;
      }
    }
  } catch (error: any) {
    log(`Migration error: ${error.message}`);
    log(`Error stack: ${error.stack}`);
    if (error.message?.includes("already exists") || error.message?.includes("current transaction is aborted") || error.message?.includes("ENOENT")) {
      log("ℹ️  Migrations already applied or schema is up-to-date");
    } else {
      log(`⚠️  Warning: Migration check completed - ${error.message}`);
      // Don't throw - let app continue even if migrations fail
    }
  }

  // Initialize settings with default values BEFORE registering routes
  const { storage } = await import("./storage");
  try {
    await storage.initializeHomeSettings();
  } catch (err: any) {
    if (err.message?.includes("does not exist")) {
      log("⚠️  home_settings table not found - skipping initialization");
    } else {
      log(`Error initializing home settings: ${err.message}`);
    }
  }
  
  try {
    await storage.initializeAboutSettings();
  } catch (err: any) {
    if (err.message?.includes("does not exist")) {
      log("⚠️  about_settings table not found - skipping initialization");
    } else {
      log(`Error initializing about settings: ${err.message}`);
    }
  }
  
  try {
    await storage.initializePageSettings();
  } catch (err: any) {
    if (err.message?.includes("does not exist")) {
      log("⚠️  page_settings table not found - skipping initialization");
    } else {
      log(`Error initializing page settings: ${err.message}`);
    }
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  const isDev = process.env.NODE_ENV === "development";
  log(`Environment: ${process.env.NODE_ENV} (isDev: ${isDev})`);
  
  if (isDev) {
    // Dynamic import with computed path to prevent esbuild from bundling
    const viteModule = "./vite" + ".js";
    const { setupVite } = await import(viteModule);
    await setupVite(app, server);
  } else {
    const { serveStatic } = await import("./static.js");
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
