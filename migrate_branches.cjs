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

async function main() {
  await runSQL('Disable RLS on branches', `ALTER TABLE branches DISABLE ROW LEVEL SECURITY;`);
  await runSQL('Disable RLS on appointments', `ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;`);
  await runSQL('Disable RLS on users', `ALTER TABLE users DISABLE ROW LEVEL SECURITY;`);
  console.log('\n✅ All RLS disabled for admin operations.');
}

main().catch(console.error);
