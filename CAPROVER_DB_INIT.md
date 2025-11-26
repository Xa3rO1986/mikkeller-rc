# CapRover Database Initialization

## Problem
Docker containers are crashing because database tables don't exist.

## Solution
Run this SQL directly on the PostgreSQL database on CapRover.

### Step 1: Connect to CapRover database
```bash
sudo docker exec -it srv-captain--mikkeller-db.1.joxp4x0ewicb1zvw9khzj9lxy psql -U root -d mikkeller_db
```

### Step 2: Copy and paste the SQL initialization commands below into psql

Run each CREATE TYPE and CREATE TABLE statement. The commands are SQL DDL that creates all required tables.

### Step 3: Restart application
```bash
sudo docker service update --force srv-captain--mikkeller-rc
```

### Alternative: Use psql with file
```bash
# Get migration SQL
sudo docker cp src/migrations/0000_numerous_jack_power.sql:/tmp/init.sql

# Execute it directly
sudo docker exec srv-captain--mikkeller-db.1.joxp4x0ewicb1zvw9khzj9lxy psql -U root -d mikkeller_db -f /tmp/init.sql
```

If you get "already exists" errors - that's OK, just means tables are already created.
