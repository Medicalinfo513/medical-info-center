const https = require('https');

const SUPABASE_TOKEN = 'sbp_98afa7c3cf7287c2149290ad95cb5793ed7c608f';
const PROJECT_REF = 'kzxmaimcisdwhsseejzd';

const sql = `
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

-- 3. Create Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid REFERENCES branches(id),
  department text,
  doctor_name text,
  specialization text,
  experience text,
  qualification text,
  consultation_fee numeric,
  available_days text[],
  image_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Create Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id text UNIQUE,
  user_id uuid REFERENCES users(id),
  doctor_id uuid REFERENCES doctors(id),
  branch_id uuid REFERENCES branches(id),
  department text,
  full_name text,
  country text,
  phone text,
  medical_concern text,
  preferred_date date,
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
`;

const data = JSON.stringify({ query: sql });

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: `/v1/projects/${PROJECT_REF}/config/database/pg-query`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let responseBody = '';
  res.on('data', (chunk) => {
    responseBody += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('SQL Executed Successfully!');
      console.log('Response:', responseBody);
    } else {
      console.error('Error executing SQL:', responseBody);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('Request Error:', error);
  process.exit(1);
});

req.write(data);
req.end();
