#!/usr/bin/env node

import bcrypt from 'bcryptjs';
import pkg from 'pg';
const { Client } = pkg;

async function createAdmin() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') 
      ? false 
      : { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Default credentials
    const username = 'admin';
    const password = 'changeme123'; // User should change this!
    const email = 'admin@mikkeller-rc.ru';
    const firstName = 'Admin';
    const lastName = 'User';

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert admin
    const result = await client.query(
      'INSERT INTO admins (username, password_hash, email, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [username, passwordHash, email, firstName, lastName]
    );

    const adminId = result.rows[0].id;

    console.log('\n✅ Admin user created successfully!\n');
    console.log('=== Login Credentials ===');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`\n⚠️  IMPORTANT: Change this password after first login!\n`);
    console.log(`Admin ID: ${adminId}`);

  } catch (error) {
    if (error.message.includes('duplicate key value')) {
      console.error('❌ Admin user already exists');
    } else if (error.message.includes('relation "admins" does not exist')) {
      console.error('❌ Admins table not found. Run migrations first: npm run db:push');
    } else {
      console.error(`❌ Error: ${error.message}`);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

createAdmin();
