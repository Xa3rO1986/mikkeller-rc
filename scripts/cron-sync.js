#!/usr/bin/env node

/**
 * Strava Activity Sync Cron Job
 * 
 * This script syncs Strava activities for all registered users.
 * It should be run periodically (e.g., hourly) via a cron job or scheduler.
 * 
 * Usage:
 *   node scripts/cron-sync.js
 * 
 * Or add to crontab:
 *   0 * * * * cd /path/to/project && node scripts/cron-sync.js >> /var/log/strava-sync.log 2>&1
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables if .env file exists
try {
  const { config } = await import('dotenv');
  config({ path: join(__dirname, '..', '.env') });
} catch (err) {
  console.log('No .env file found, using system environment variables');
}

async function main() {
  console.log(`[${new Date().toISOString()}] Starting Strava activity sync`);

  try {
    // Import the Strava sync service
    const { stravaSync } = await import('../server/services/strava-sync.ts');

    // Sync all users
    await stravaSync.syncAllUsers();

    console.log(`[${new Date().toISOString()}] Sync completed successfully`);
    process.exit(0);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Sync failed:`, error);
    process.exit(1);
  }
}

main();
