-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  email text UNIQUE,
  phone text,
  country text,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Create Branches Table
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_name text,
  city text,
  description text,
  image_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Create Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id text UNIQUE,
  user_id uuid REFERENCES users(id),
  branch_id uuid REFERENCES branches(id),
  department text,
  full_name text,
  country text,
  phone text,
  medical_concern text,
  preferred_date date,
  email text,
  report_url text,
  payment_status text DEFAULT 'Pending',
  booking_status text DEFAULT 'Pending',
  advance_paid numeric,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. Create Storage Bucket for Medical Reports
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical-reports', 'medical-reports', true)
ON CONFLICT (id) DO NOTHING;
