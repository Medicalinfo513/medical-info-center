-- Run these queries in your Supabase SQL Editor to enable Admin Panel features

-- 1. Add role to users
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- 2. Add is_active to branches
ALTER TABLE IF EXISTS branches ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- 3. Add is_active to doctors
ALTER TABLE IF EXISTS doctors ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- 4. Create/Update Specialties Table
CREATE TABLE IF NOT EXISTS specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE,
  subtitle text,
  created_at timestamp with time zone DEFAULT now()
);

-- Add missing columns to specialties
ALTER TABLE specialties ADD COLUMN IF NOT EXISTS icon_name text;
ALTER TABLE specialties ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE specialties ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE specialties ADD COLUMN IF NOT EXISTS subtitle text;

-- Ensure specialties has a UNIQUE constraint on name for UPSERT
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'specialties_name_key'
    ) THEN
        ALTER TABLE specialties ADD CONSTRAINT specialties_name_key UNIQUE (name);
    END IF;
END $$;

-- 5. Create Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE,
  value text,
  created_at timestamp with time zone DEFAULT now()
);

-- 6. Insert default settings
INSERT INTO settings (key, value) VALUES ('advance_booking_fee_domestic', '500') ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('advance_booking_fee_international', '30') ON CONFLICT (key) DO NOTHING;

-- 7. Seed Specialties (aligned with current UI)
INSERT INTO specialties (name, subtitle, icon_name, color) VALUES
('Cardiology', 'Heart Care', 'Heart', '#ef4444'),
('Neurology', 'Brain & Nerve', 'Brain', '#8b5cf6'),
('Orthopedics', 'Joint & Bone', 'Bone', '#f97316'),
('General Medicine', 'General Checkup', 'Activity', '#2563eb'),
('Pediatrics', 'Child Care', 'Baby', '#22c55e'),
('Ophthalmology', 'Eye Care', 'Eye', '#06b6d4'),
('Pharmacy', 'Pharmacy', 'Pill', '#10b981')
ON CONFLICT (name) DO UPDATE SET
  subtitle = EXCLUDED.subtitle,
  icon_name = EXCLUDED.icon_name,
  color = EXCLUDED.color;

-- 8. SET YOURSELF AS ADMIN (REPLACE THE ID WITH YOUR USER ID)
-- UPDATE users SET role = 'admin' WHERE id = 'YOUR_USER_ID_HERE';
