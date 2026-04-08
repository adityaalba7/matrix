import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

// Note: Using WebSocket Neon Serverless driver to bypass TCP issues and strict TLS handshakes
// that Neon recently enabled which breaks standard node-postgres drivers.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.once('connect', () => {
  console.log('✅ PostgreSQL pool connected');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err.message);
});

export const query = (text, params) => pool.query(text, params);

export default pool;
