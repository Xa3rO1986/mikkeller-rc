import { Router, type Request, type Response } from "express";
import { db } from "../db";
import { stravaAccounts, type InsertStravaAccount } from "@shared/schema";
import { eq } from "drizzle-orm";
import { stravaSync } from "../services/strava-sync";

const router = Router();

// Strava credentials - check if configured
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const STRAVA_REDIRECT_URI = process.env.STRAVA_REDIRECT_URI;

const isStravaConfigured = !!(STRAVA_CLIENT_ID && STRAVA_CLIENT_SECRET && STRAVA_REDIRECT_URI);

interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: {
    id: number;
    firstname: string;
    lastname: string;
    profile: string;
  };
}

/**
 * GET /api/strava/auth
 * Redirect user to Strava authorization page
 */
router.get("/auth", (_req: Request, res: Response) => {
  // Graceful degradation: redirect to rating page with error if Strava not configured
  if (!isStravaConfigured) {
    console.warn("Strava OAuth attempted but integration is not configured. Set STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, and STRAVA_REDIRECT_URI environment variables.");
    return res.redirect("/rating?error=not_configured");
  }

  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(STRAVA_REDIRECT_URI!)}&scope=activity:read_all`;
  
  res.redirect(authUrl);
});

/**
 * GET /api/strava/callback
 * Handle OAuth callback from Strava
 */
router.get("/callback", async (req: Request, res: Response) => {
  if (!isStravaConfigured) {
    return res.redirect("/rating?error=not_configured");
  }

  const { code, error } = req.query;

  if (error || !code) {
    return res.redirect("/rating?error=auth_failed");
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID!,
        client_secret: STRAVA_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Strava token exchange failed:", tokenResponse.statusText);
      return res.redirect("/rating?error=token_failed");
    }

    const data: StravaTokenResponse = await tokenResponse.json();

    // Check if user already exists
    const [existingAccount] = await db
      .select()
      .from(stravaAccounts)
      .where(eq(stravaAccounts.stravaId, data.athlete.id))
      .limit(1);

    let userId: string;

    if (existingAccount) {
      // Update existing account with new tokens
      userId = existingAccount.userId;
      await db
        .update(stravaAccounts)
        .set({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: data.expires_at,
          firstName: data.athlete.firstname,
          lastName: data.athlete.lastname,
          profilePicture: data.athlete.profile,
          updatedAt: new Date(),
        })
        .where(eq(stravaAccounts.id, existingAccount.id));
    } else {
      // Create new account
      const accountData: InsertStravaAccount = {
        userId: crypto.randomUUID(),
        stravaId: data.athlete.id,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_at,
        firstName: data.athlete.firstname,
        lastName: data.athlete.lastname,
        profilePicture: data.athlete.profile,
      };

      const [newAccount] = await db
        .insert(stravaAccounts)
        .values(accountData)
        .returning();

      userId = newAccount.userId;

      // Trigger initial sync for new user (non-blocking)
      stravaSync.syncUserActivities(newAccount).catch((error) => {
        console.error(`Error syncing activities for new user ${userId}:`, error);
      });
    }

    // Store userId in session (optional - for future use)
    if (req.session) {
      (req.session as any).stravaUserId = userId;
    }

    // Redirect to rating page
    res.redirect("/rating?success=true");
  } catch (error) {
    console.error("Error in Strava callback:", error);
    res.redirect("/rating?error=server_error");
  }
});

/**
 * GET /api/strava/sync/:userId
 * Manually trigger sync for a specific user (admin only in future)
 */
router.post("/sync/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const [account] = await db
      .select()
      .from(stravaAccounts)
      .where(eq(stravaAccounts.userId, userId))
      .limit(1);

    if (!account) {
      return res.status(404).json({ message: "User not found" });
    }

    const syncedCount = await stravaSync.syncUserActivities(account);

    res.json({
      message: "Sync completed",
      activitiesSynced: syncedCount,
    });
  } catch (error: any) {
    console.error("Error syncing user:", error);
    res.status(500).json({ message: error.message || "Sync failed" });
  }
});

export default router;
