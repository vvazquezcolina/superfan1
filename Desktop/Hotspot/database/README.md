# Database Setup and Migrations

This directory contains the database schema and migration scripts for the Ubiquiti Hotspot Portal.

## Quick Start

1. **Configure Database Connection**
   - Edit `api/config/database.php` with your Bluehost MySQL credentials
   - Update the database configuration with your actual values

2. **Run Migrations**
   ```bash
   php database/migrate.php migrate
   ```

## Migration Commands

### Run All Migrations
```bash
php database/migrate.php migrate
```
Executes all pending migrations in order.

### Check Migration Status
```bash
php database/migrate.php status
```
Shows which migrations have been executed and when.

### Reset Database (WARNING: Destructive!)
```bash
php database/migrate.php reset
```
Drops all tables and resets the database. Use with caution!

## Database Schema

### Tables Created

1. **users** - Stores guest registration information
   - `id` - Primary key
   - `first_name` - User's first name
   - `last_name` - User's last name
   - `email` - User's email (unique)
   - `verification_token` - Email verification token
   - `is_verified` - Email verification status
   - `mac_address` - Device MAC address
   - `ip_address` - Device IP address
   - `user_agent` - Browser/device information
   - Timestamps for creation, verification, and last access

2. **sessions** - Tracks WiFi sessions and UniFi integration
   - `id` - Primary key
   - `user_id` - Foreign key to users table
   - `session_token` - Unique session identifier
   - `mac_address` - Device MAC address
   - `ip_address` - Device IP address
   - `unifi_session_id` - UniFi Controller session ID
   - `access_point_mac` - Access point MAC address
   - `ssid` - WiFi network name
   - Session timing and data usage tracking
   - Session status (active, expired, terminated)

3. **migrations** - Tracks executed migrations
   - `id` - Primary key
   - `migration_name` - Name of the migration file
   - `executed_at` - When the migration was executed

## Bluehost Setup Instructions

1. **Create Database**
   - Log into your Bluehost cPanel
   - Go to "MySQL Databases"
   - Create a new database (e.g., `hotspot_portal`)

2. **Create Database User**
   - Create a new MySQL user with a strong password
   - Add the user to the database with "All Privileges"

3. **Update Configuration**
   - Edit `api/config/database.php`
   - Update these values:
     ```php
     'username' => 'your_cpanel_username_dbuser',
     'password' => 'your_database_password',
     'database' => 'your_cpanel_username_hotspot_portal'
     ```

4. **Run Migrations**
   - Upload files to your Bluehost server
   - Run migrations via SSH or cPanel File Manager terminal:
     ```bash
     php database/migrate.php migrate
     ```

## File Structure

```
database/
├── README.md                           # This file
├── migrate.php                         # Migration runner script
└── migrations/
    ├── 001_create_users_table.sql      # Users table schema
    └── 002_create_sessions_table.sql   # Sessions table schema
```

## Adding New Migrations

1. Create a new SQL file in `migrations/` directory
2. Use naming convention: `XXX_description.sql` (e.g., `003_add_user_preferences.sql`)
3. Write SQL statements to modify the database
4. Run `php database/migrate.php migrate` to execute

## Troubleshooting

- **Connection Error**: Check database credentials in `api/config/database.php`
- **Permission Error**: Ensure database user has sufficient privileges
- **Migration Failed**: Check error logs and fix SQL syntax
- **Bluehost Timeout**: Migrations are optimized for Bluehost with 30-second timeout

## Security Notes

- Never commit real database credentials to version control
- Use environment variables for production credentials
- Regularly backup your database before running migrations
- Test migrations on a development environment first 