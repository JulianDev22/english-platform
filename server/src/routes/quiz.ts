import { Router } from 'express';
import { getDb } from '../db/schema.js';
import { queryAll } from '../db/helpers.js';

const router = Router();

router.get('/:activityId', async (req, res) => {
  const db = await getDb();
  const questions = queryAll(db, 'SELECT * FROM quiz_questions WHERE activity_id = ? ORDER BY sort_order', [req.params.activityId]);
  res.json(questions);
});

export default router;
