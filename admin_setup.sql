-- Run these queries in your Supabase SQL Editor to enable Admin Panel features

-- 1. Add role to users
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- 2. Add is_active to branches
ALTER TABLE IF EXISTS branches ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- 3. Create Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE,
  value text,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Insert default settings
INSERT INTO settings (key, value) VALUES ('advance_booking_fee_domestic', '500') ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('advance_booking_fee_international', '30') ON CONFLICT (key) DO NOTHING;

-- 8. SET YOURSELF AS ADMIN (REPLACE THE ID WITH YOUR USER ID)
-- UPDATE users SET role = 'admin' WHERE id = 'YOUR_USER_ID_HERE';
