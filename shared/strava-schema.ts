import { pgTable, varchar, text, bigint, integer, real, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
import { z } from "zod";

// Strava accounts table - stores OAuth tokens and user mapping
export const stravaAccounts = pgTable("strava_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(), // Internal user identifier
  stravaId: bigint("strava_id", { mode: "number" }).notNull().unique(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: bigint("expires_at", { mode: "number" }).notNull(), // Unix timestamp
  firstName: text("first_name"),
  lastName: text("last_name"),
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("strava_accounts_strava_id_idx").on(table.stravaId),
  index("strava_accounts_user_id_idx").on(table.userId),
]);

export const insertStravaAccountSchema = createInsertSchema(stravaAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertStravaAccount = z.infer<typeof insertStravaAccountSchema>;
export type StravaAccount = typeof stravaAccounts.$inferSelect;

// Activities table - stores Strava running activities
export const activities = pgTable("activities", {
  id: bigint("id", { mode: "number" }).primaryKey(), // Strava activity ID
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  distance: real("distance").notNull(), // meters
  movingTime: integer("moving_time").notNull(), // seconds
  sportType: text("sport_type").notNull(),
  polyline: text("polyline"),
  startDate: timestamp("start_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("activities_user_id_idx").on(table.userId),
  index("activities_start_date_idx").on(table.startDate),
  index("activities_sport_type_idx").on(table.sportType),
]);

export const insertActivitySchema = createInsertSchema(activities).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
