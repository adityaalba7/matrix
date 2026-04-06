import cron from 'node-cron';
import { query } from '../db/index.js';
import { computeScoreForUser } from '../utils/computeScore.js';

cron.schedule('0 20 * * *', async () => {
  console.log('[cron] computeScores — starting batch at', new Date().toISOString());

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { rows: users } = await query(
      `SELECT id FROM users WHERE last_active_at >= $1`,
      [sevenDaysAgo]
    );

    console.log(`[cron] computeScores — processing ${users.length} active users`);

    const results = await Promise.allSettled(
      users.map(u => computeScoreForUser(u.id))
    );

    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length > 0) {
      console.error(`[cron] computeScores — ${failed.length} users failed`, failed.map(f => f.reason));
    }

    console.log('[cron] computeScores — done');
  } catch (err) {
    console.error('[cron] computeScores — fatal error:', err.message);
  }
}, {
  timezone: 'UTC',
});
