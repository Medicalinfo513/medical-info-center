const https = require('https');
const PROJECT_REF = 'kzxmaimcisdwhsseejzd';
const SUPABASE_TOKEN = 'sbp_98afa7c3cf7287c2149290ad95cb5793ed7c608f';

async function runSQL(label, sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: `/v1/projects/${PROJECT_REF}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const ok = res.statusCode >= 200 && res.statusCode < 300;
        console.log(`${ok ? '✅' : '❌'} ${label} (${res.statusCode})`);
        if (!ok) console.log('   ', data);
        resolve({ ok, data });
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const specialties = [
  { name: 'Obstetrician (OB)', subtitle: 'For pregnancy, labor, childbirth', category: "Women’s Health Specialists" },
  { name: 'Gynaecologist (GYN)', subtitle: 'For non-pregnancy reproductive health', category: "Women’s Health Specialists" },
  { name: 'Maternal-Fetal Medicine Specialist', subtitle: 'For high-risk pregnancy', category: "Women’s Health Specialists" },
  { name: 'Reproductive Endocrinologist', subtitle: 'For infertility and hormonal disorders', category: "Women’s Health Specialists" },
  { name: 'Gynecologic Oncologist', subtitle: 'For reproductive system cancers', category: "Women’s Health Specialists" },
  { name: 'Urogynecologist', subtitle: 'For pelvic floor and urinary disorders', category: "Women’s Health Specialists" },
  { name: 'Family Physician', subtitle: 'For patients of all ages', category: "Primary Care Specialists" },
  { name: 'Pediatrician', subtitle: 'For infants, children, and teenagers', category: "Primary Care Specialists" },
  { name: 'Internist', subtitle: 'For adult medicine', category: "Primary Care Specialists" },
  { name: 'Geriatrician', subtitle: 'For elderly adults', category: "Primary Care Specialists" },
  { name: 'Cardiologist', subtitle: 'For heart and blood vessels', category: "Organ and System Specialists" },
  { name: 'Dermatologist', subtitle: 'For skin, hair, and nails', category: "Organ and System Specialists" },
  { name: 'Neurologist', subtitle: 'For brain, spinal cord, and nerves', category: "Organ and System Specialists" },
  { name: 'Gastroenterologist', subtitle: 'For digestive system', category: "Organ and System Specialists" },
  { name: 'Nephrologist', subtitle: 'For kidney diseases', category: "Organ and System Specialists" },
  { name: 'Pulmonologist', subtitle: 'For lungs and respiratory system', category: "Organ and System Specialists" },
  { name: 'Endocrinologist', subtitle: 'For hormones and glands', category: "Organ and System Specialists" },
  { name: 'Ophthalmologist', subtitle: 'For eyes and eye surgeries', category: "Organ and System Specialists" },
  { name: 'Otolaryngologist (ENT)', subtitle: 'For ear, nose, and throat', category: "Organ and System Specialists" },
  { name: 'Urologist', subtitle: 'For urinary tract and male reproductive organs', category: "Organ and System Specialists" },
  { name: 'Rheumatologist', subtitle: 'For autoimmune diseases and joint pain', category: "Organ and System Specialists" },
  { name: 'Hematologist', subtitle: 'For blood disorders', category: "Organ and System Specialists" },
  { name: 'General Surgeon', subtitle: 'For various abdominal surgeries', category: "Surgical and Other Specialists" },
  { name: 'Orthopaedic Surgeon', subtitle: 'For bones, joints, and ligaments', category: "Surgical and Other Specialists" },
  { name: 'Oncologist', subtitle: 'For cancer diagnosis and treatment', category: "Surgical and Other Specialists" },
  { name: 'Psychiatrist', subtitle: 'For mental and emotional disorders', category: "Surgical and Other Specialists" },
  { name: 'Radiologist', subtitle: 'For medical images like X-rays/MRI', category: "Surgical and Other Specialists" },
  { name: 'Anesthesiologist', subtitle: 'For pain and sedation during surgery', category: "Surgical and Other Specialists" }
];

async function main() {
  // Create table
  await runSQL('Create specialties table', `
    CREATE TABLE IF NOT EXISTS specialties (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      subtitle text,
      category text,
      image_url text,
      status text DEFAULT 'Active',
      created_at timestamptz DEFAULT now()
    );
    ALTER TABLE specialties DISABLE ROW LEVEL SECURITY;
  `);

  // Create bucket
  await runSQL('Create storage bucket specialty-symbols', `
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('specialty-symbols', 'specialty-symbols', true)
    ON CONFLICT (id) DO NOTHING;
  `);

  // Seed data
  const values = specialties.map(s => `('${s.name}', '${s.subtitle}', '${s.category}', 'Active')`).join(',');
  await runSQL('Seed specialties', `
    TRUNCATE specialties;
    INSERT INTO specialties (name, subtitle, category, status)
    VALUES ${values};
  `);

  console.log('\n✅ Specialties table created and seeded.');
}

main().catch(console.error);
