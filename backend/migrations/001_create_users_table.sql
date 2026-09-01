-- Migration: Create users table with roles and admin support
-- Run this migration on your PostgreSQL database

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('guest', 'user', 'admin');

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: Admin@12345)
-- Note: In production, use a secure random password and change immediately
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

-- Verify the admin was created
SELECT id, email, full_name, role, is_active, is_verified, created_at FROM users WHERE email = 'admin@gharbudget.app';