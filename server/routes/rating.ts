import { Router, type Request, type Response } from "express";
import { db } from "../db";
import { activities, stravaAccounts } from "@shared/schema";
import { sql, eq } from "drizzle-orm";

const router = Router();

interface RatingEntry {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  profilePicture: string | null;
  totalDistance: number;
  totalActivities: number;
  totalTime: number;
}

/**
 * GET /api/rating?year=YYYY&month=MM
 * Get leaderboard of users by total distance
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;

    let yearNum: number | null = null;
    let monthNum: number | null = null;

    if (year) {
      yearNum = parseInt(year as string, 10);
      if (isNaN(yearNum)) {
        return res.status(400).json({ message: "Invalid year parameter" });
      }
    }

    if (month) {
      monthNum = parseInt(month as string, 10);
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({ message: "Invalid month parameter" });
      }
    }

    // Build SQL query with date filters
    let query = db
      .select({
        userId: activities.userId,
        totalDistance: sql<number>`SUM(${activities.distance})`,
        totalActivities: sql<number>`COUNT(*)`,
        totalTime: sql<number>`SUM(${activities.movingTime})`,
      })
      .from(activities)
      .$dynamic();

    // Apply year filter
    if (yearNum !== null) {
      query = query.where(
        sql`EXTRACT(YEAR FROM ${activities.startDate}) = ${yearNum}`
      );
    }

    // Apply month filter
    if (monthNum !== null) {
      query = query.where(
        sql`EXTRACT(MONTH FROM ${activities.startDate}) = ${monthNum}`
      );
    }

    const results = await query
      .groupBy(activities.userId)
      .orderBy(sql`SUM(${activities.distance}) DESC`);

    // Fetch user details
    const rating: RatingEntry[] = [];
    for (const result of results) {
      const [account] = await db
        .select()
        .from(stravaAccounts)
        .where(eq(stravaAccounts.userId, result.userId))
        .limit(1);

      if (account) {
        rating.push({
          userId: result.userId,
          firstName: account.firstName,
          lastName: account.lastName,
          profilePicture: account.profilePicture,
          totalDistance: Math.round(result.totalDistance), // meters
          totalActivities: result.totalActivities,
          totalTime: result.totalTime, // seconds
        });
      }
    }

    res.json(rating);
  } catch (error: any) {
    console.error("Error fetching rating:", error);
    res.status(500).json({ message: error.message || "Failed to fetch rating" });
  }
});

export default router;
