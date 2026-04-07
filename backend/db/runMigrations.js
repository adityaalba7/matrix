import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Run all pending migrations
 * Migrations are SQL files in db/migrations/ directory
 * They are executed in alphabetical order
 */
const runMigrations = async () => {
  try {
    console.log('🔄 Running database migrations...');

    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Get all migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('✅ No migrations directory found. Skipping migrations.');
      return;
    }

    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (migrationFiles.length === 0) {
      console.log('✅ No migration files found.');
      return;
    }

    // Get already executed migrations
    const { rows: executedMigrations } = await pool.query(
      'SELECT version FROM schema_migrations'
    );
    const executedVersions = new Set(executedMigrations.map(m => m.version));

    // Run pending migrations
    for (const file of migrationFiles) {
      const version = file;

      if (executedVersions.has(version)) {
        console.log(`⏭️  Skipping already executed migration: ${file}`);
        continue;
      }

      console.log(`📝 Running migration: ${file}`);

      const migrationPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(migrationPath, 'utf-8');

      await pool.query('BEGIN');
      try {
        await pool.query(sql);
        await pool.query(
          'INSERT INTO schema_migrations (version) VALUES ($1)',
          [version]
        );
        await pool.query('COMMIT');
        console.log(`✅ Migration completed: ${file}`);
      } catch (err) {
        await pool.query('ROLLBACK');
        console.error(`❌ Migration failed: ${file}`, err);
        throw err;
      }
    }

    console.log('✅ All migrations completed successfully!');
  } catch (err) {
    console.error('❌ Migration error:', err);
    process.exit(1);
  } finally {
    pool.end();
  }
};

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}

export default runMigrations;
