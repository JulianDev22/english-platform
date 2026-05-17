import { Router } from 'express';
import { getDb } from '../db/schema.js';
import { queryAll, queryOne } from '../db/helpers.js';

const router = Router();

router.get('/:id', async (req, res) => {
  const db = await getDb();
  const unit = queryOne(db, 'SELECT * FROM units WHERE id = ?', [req.params.id]);
  if (!unit) return res.status(404).json({ error: 'Unit not found' });

  const topics = queryAll(db, 'SELECT * FROM topics WHERE unit_id = ? ORDER BY sort_order', [req.params.id]);
  const activities = queryAll(db, `
    SELECT a.*, up.completed, up.score
    FROM activities a
    LEFT JOIN user_progress up ON up.activity_id = a.id
    WHERE a.unit_id = ? ORDER BY a.sort_order
  `, [req.params.id]);

  res.json({ ...unit, topics, activities });
});

export default router;
