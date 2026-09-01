-- Migration: Add role column to existing users table (if not already present)
-- Run this if you have an existing users table without the role column

-- Add role column with default value 'user'
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users 
        ADD COLUMN role user_role NOT NULL DEFAULT 'user';
        
        -- Create index on role
        CREATE INDEX idx_users_role ON users(role);
        
        RAISE NOTICE 'Added role column to users table';
    ELSE
        RAISE NOTICE 'Role column already exists';
    END IF;
END $$;

-- Add is_verified column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'is_verified'
    ) THEN
        ALTER TABLE users 
        ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE;
        
        RAISE NOTICE 'Added is_verified column to users table';
    ELSE
        RAISE NOTICE 'is_verified column already exists';
    END IF;
END $$;

-- Add last_login column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'last_login'
    ) THEN
        ALTER TABLE users 
        ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;
        
        RAISE NOTICE 'Added last_login column to users table';
    ELSE
        RAISE NOTICE 'last_login column already exists';
    END IF;
END $$;

-- Ensure default admin exists
INSERT INTO users (email, full_name, password_hash, role, is_active, is_verified, created_at, updated_at)
VALUES (
    'admin@gharbudget.app',
    'System Administrator',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PZvO.S', -- bcrypt hash of 'Admin@12345'
    'admin',
    TRUE,
    TRUE,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;