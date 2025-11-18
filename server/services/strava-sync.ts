import { db } from "../db";
import { stravaAccounts, activities, type StravaAccount, type InsertActivity } from "@shared/schema";
import { eq } from "drizzle-orm";

interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  sport_type: string;
  map?: {
    summary_polyline?: string;
  };
  start_date: string;
}

export class StravaSync {
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = process.env.STRAVA_CLIENT_ID!;
    this.clientSecret = process.env.STRAVA_CLIENT_SECRET!;
  }

  /**
   * Refresh Strava access token if expired
   */
  async refreshToken(account: StravaAccount): Promise<StravaTokenResponse | null> {
    const now = Math.floor(Date.now() / 1000);
    
    // Token still valid, no need to refresh
    if (account.expiresAt > now + 300) {
      return {
        access_token: account.accessToken,
        refresh_token: account.refreshToken,
        expires_at: account.expiresAt,
      };
    }

    try {
      const response = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "refresh_token",
          refresh_token: account.refreshToken,
        }),
      });

      if (!response.ok) {
        console.error(`Failed to refresh token for user ${account.userId}:`, response.statusText);
        return null;
      }

      const data: StravaTokenResponse = await response.json();

      // Update tokens in database
      await db
        .update(stravaAccounts)
        .set({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: data.expires_at,
          updatedAt: new Date(),
        })
        .where(eq(stravaAccounts.id, account.id));

      return data;
    } catch (error) {
      console.error(`Error refreshing token for user ${account.userId}:`, error);
      return null;
    }
  }

  /**
   * Fetch all running activities from Strava
   */
  async fetchActivities(accessToken: string, page = 1, perPage = 200): Promise<StravaActivity[]> {
    try {
      const response = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch activities:", response.statusText);
        return [];
      }

      const data: StravaActivity[] = await response.json();
      
      // Filter only Run and TrailRun activities
      return data.filter(
        (activity) => activity.sport_type === "Run" || activity.sport_type === "TrailRun"
      );
    } catch (error) {
      console.error("Error fetching activities:", error);
      return [];
    }
  }

  /**
   * Sync activities for a single user
   */
  async syncUserActivities(account: StravaAccount): Promise<number> {
    // Refresh token if needed
    const tokens = await this.refreshToken(account);
    if (!tokens) {
      console.error(`Cannot sync activities for user ${account.userId}: token refresh failed`);
      return 0;
    }

    let allActivities: StravaActivity[] = [];
    let page = 1;
    const perPage = 200;

    // Fetch all pages of activities
    while (true) {
      const pageActivities = await this.fetchActivities(tokens.access_token, page, perPage);
      
      if (pageActivities.length === 0) {
        break;
      }

      allActivities = allActivities.concat(pageActivities);
      
      // If we got less than perPage, we've reached the end
      if (pageActivities.length < perPage) {
        break;
      }

      page++;
    }

    // Save activities to database
    let syncedCount = 0;
    for (const activity of allActivities) {
      try {
        const activityData: InsertActivity = {
          id: activity.id,
          userId: account.userId,
          name: activity.name,
          distance: activity.distance,
          movingTime: activity.moving_time,
          sportType: activity.sport_type,
          polyline: activity.map?.summary_polyline || null,
          startDate: new Date(activity.start_date),
        };

        // Insert or update activity
        await db
          .insert(activities)
          .values(activityData)
          .onConflictDoUpdate({
            target: activities.id,
            set: {
              name: activityData.name,
              distance: activityData.distance,
              movingTime: activityData.movingTime,
              sportType: activityData.sportType,
              polyline: activityData.polyline,
              startDate: activityData.startDate,
              updatedAt: new Date(),
            },
          });

        syncedCount++;
      } catch (error) {
        console.error(`Error saving activity ${activity.id}:`, error);
      }
    }

    console.log(`Synced ${syncedCount} activities for user ${account.userId}`);
    return syncedCount;
  }

  /**
   * Sync activities for all users
   */
  async syncAllUsers(): Promise<void> {
    const accounts = await db.select().from(stravaAccounts);

    console.log(`Starting sync for ${accounts.length} Strava accounts`);

    for (const account of accounts) {
      try {
        await this.syncUserActivities(account);
      } catch (error) {
        console.error(`Error syncing user ${account.userId}:`, error);
      }
    }

    console.log("Sync completed for all users");
  }
}

export const stravaSync = new StravaSync();
