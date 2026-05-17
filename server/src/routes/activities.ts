import { Router } from 'express';
import { getDb } from '../db/schema.js';
import { queryAll, queryOne } from '../db/helpers.js';

const router = Router();

router.get('/:id', async (req, res) => {
  const db = await getDb();
  const act = queryOne(db, 'SELECT * FROM activities WHERE id = ?', [req.params.id]);
  if (!act) return res.status(404).json({ error: 'Activity not found' });

  let data = null;
  if (act.activity_type === 'flashcard') {
    data = queryAll(db, 'SELECT * FROM flashcards WHERE activity_id = ? ORDER BY sort_order', [act.id]);
  } else if (act.activity_type === 'quiz') {
    data = queryAll(db, 'SELECT * FROM quiz_questions WHERE activity_id = ? ORDER BY sort_order', [act.id]);
  }

  const progress = queryOne(db, 'SELECT * FROM user_progress WHERE activity_id = ?', [act.id]);

  res.json({
    ...act,
    config: act.config ? JSON.parse(act.config as string) : null,
    data,
    completed: progress ? !!progress.completed : false,
    score: progress ? progress.score : null,
  });
});

export default router;
