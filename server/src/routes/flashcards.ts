import { Router } from 'express';
import { getDb } from '../db/schema.js';
import { queryAll } from '../db/helpers.js';

const router = Router();

router.get('/:activityId', async (req, res) => {
  const db = await getDb();
  const cards = queryAll(db, 'SELECT * FROM flashcards WHERE activity_id = ? ORDER BY sort_order', [req.params.activityId]);
  res.json(cards);
});

export default router;
