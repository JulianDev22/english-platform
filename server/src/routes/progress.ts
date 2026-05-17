import { Router } from 'express';
import { getDb, saveDatabase } from '../db/schema.js';
import { queryAll, queryOne, runStmt } from '../db/helpers.js';

const router = Router();

router.get('/', async (_req, res) => {
  const db = await getDb();
  const progress = queryAll(db, 'SELECT * FROM user_progress ORDER BY activity_id');
  res.json(progress);
});

router.post('/', async (req, res) => {
  const db = await getDb();
  const { activity_id, completed, score } = req.body;

  const existing = queryOne(db, 'SELECT * FROM user_progress WHERE activity_id = ?', [activity_id]);
  if (existing) {
    runStmt(db, `
      UPDATE user_progress SET completed = ?, score = COALESCE(?, score),
        attempts = attempts + 1, last_attempt_at = datetime('now'), updated_at = datetime('now')
      WHERE activity_id = ?
    `, [completed ? 1 : 0, score, activity_id]);
  } else {
    runStmt(db, `
      INSERT INTO user_progress (activity_id, completed, score, attempts, last_attempt_at)
      VALUES (?, ?, ?, 1, datetime('now'))
    `, [activity_id, completed ? 1 : 0, score]);
  }

  saveDatabase();

  const updated = queryOne(db, 'SELECT * FROM user_progress WHERE activity_id = ?', [activity_id]);
  res.json(updated);
});

export default router;
