import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

const url = process.env.DATABASE_URL || '';

let host, port, database, user, password;
try {
  const u = new URL(url);
  host     = u.hostname;
  port     = parseInt(u.port) || 5432;
  database = u.pathname.replace(/^\//, '');
  user     = decodeURIComponent(u.username);
  password = decodeURIComponent(u.password);
} catch (e) {
  console.error('❌ Failed to parse DATABASE_URL:', e.message);
  process.exit(1);
}

console.log('\n🔍 Connection details:');
console.log(`   Host     : ${host}`);
console.log(`   Port     : ${port}`);
console.log(`   Database : ${database}`);
console.log(`   User     : ${user}`);
console.log(`   SSL      : rejectUnauthorized=false\n`);

const client = new Client({
  host, port, database, user, password,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 20000,
});

console.log('⏳ Connecting...');

client.connect()
  .then(async () => {
    console.log('✅ Connected successfully!\n');
    const res = await client.query('SELECT NOW() as time, current_database() as db');
    console.log('📊 Query result:', res.rows[0]);
    await client.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Connection FAILED');
    console.error('   Message :', err.message);
    console.error('   Code    :', err.code);
    if (err.cause) console.error('   Cause   :', err.cause.message);
    console.error('\n💡 Possible fixes:');
    console.error('   1. Log into console.neon.tech and check if your project is SUSPENDED');
    console.error('   2. Verify the project/branch still exists');
    console.error('   3. Generate a fresh connection string from Neon dashboard');
    process.exit(1);
  });
