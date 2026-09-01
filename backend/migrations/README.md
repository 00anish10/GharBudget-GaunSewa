# Database Migrations

## Running Migrations

### Option 1: Using the backend startup (automatic)
The FastAPI backend automatically creates tables on startup via `init_db()` in `main.py`. This uses SQLAlchemy's `metadata.create_all()`.

### Option 2: Manual SQL Migration (recommended for production)

Run the SQL files in order:

```bash
# Connect to your PostgreSQL database
psql -h localhost -U postgres -d gharbudget -f backend/migrations/001_create_users_table.sql
psql -h localhost -U postgres -d gharbudget -f backend/migrations/002_add_role_column.sql
```

### Option 3: Using pgAdmin or DBeaver
Open the SQL files and execute them in your database management tool.

## Default Admin Credentials

After running migrations, the default admin user will be created:

- **Email:** `admin@gharbudget.app`
- **Password:** `Admin@12345`

**⚠️ Important:** Change the default admin password immediately after first login in production!

## Migration Files

| File | Description |
|------|-------------|
| `001_create_users_table.sql` | Creates the users table with all columns, indexes, triggers, and default admin |
| `002_add_role_column.sql` | Safe migration to add role column to existing tables |

## Schema Overview

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',  -- 'guest' | 'user' | 'admin'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

## Role Hierarchy

- **admin** - Full access to all features including admin dashboard and user management
- **user** - Standard user access to budget, goals, GaunSewa marketplace
- **guest** - Public access only (not authenticated)

## Verification

After migration, verify the admin user exists:

```sql
SELECT id, email, full_name, role, is_active, is_verified, created_at 
FROM users 
WHERE email = 'admin@gharbudget.app';
```