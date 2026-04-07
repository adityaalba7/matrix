import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false } 
});

try {
  // Find all check constraints on interview_sessions
  const result = await pool.query(`
    SELECT conname FROM pg_constraint 
    WHERE conrelid = 'interview_sessions'::regclass 
    AND contype = 'c'
  `);
  
  console.log('All check constraints on interview_sessions:', result.rows);
  
  for (const row of result.rows) {
    await pool.query(`ALTER TABLE interview_sessions DROP CONSTRAINT IF EXISTS "${row.conname}"`);
    console.log('Dropped constraint:', row.conname);
  }
  
  console.log('✅ All CHECK constraints removed. Free-form domain/round_type values now allowed.');
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await pool.end();
}
