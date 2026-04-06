import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = async () => {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    console.log('Running schema migrations on Neon...');
    await pool.query(schemaSql);
    console.log('✅ Migrations completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    pool.end();
  }
};

runMigrations();
