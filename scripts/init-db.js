#!/usr/bin/env node
import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';

async function initDB() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') 
      ? false 
      : { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Read and execute migration SQL
    const migrationPath = path.join(process.cwd(), 'migrations', '0000_numerous_jack_power.sql');
    if (fs.existsSync(migrationPath)) {
      const sql = fs.readFileSync(migrationPath, 'utf-8');
      console.log('🔄 Running migrations...');
      
      // Split by --> statement-breakpoint and execute each statement
      const statements = sql.split('-->').map(s => s.trim()).filter(s => s);
      
      let count = 0;
      for (const statement of statements) {
        const cleanStmt = statement.replace('statement-breakpoint', '').trim();
        if (cleanStmt.length > 10) {
          try {
            await client.query(cleanStmt);
            count++;
          } catch (err) {
            // Ignore "already exists" errors
            if (!err.message.includes('already exists')) {
              console.warn(`⚠️ Statement error: ${err.message.substring(0, 100)}`);
            }
          }
        }
      }
      console.log(`✅ Executed ${count} migration statements`);
    } else {
      console.log('ℹ️  No migration file found, skipping');
    }

    await client.end();
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

initDB();
