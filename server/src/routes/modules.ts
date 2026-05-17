import { Router } from 'express';
import { getDb } from '../db/schema.js';
import { queryAll, queryOne, runStmt } from '../db/helpers.js';

const router = Router();

router.get('/', async (_req, res) => {
  const db = await getDb();
  const modules = queryAll(db, `
    SELECT m.*,
      (SELECT COUNT(*) FROM user_progress up
       JOIN activities a ON up.activity_id = a.id
       JOIN units u ON a.unit_id = u.id
       WHERE u.module_id = m.id AND up.completed = 1) * 1.0 /
      NULLIF((SELECT COUNT(*) FROM activities a
       JOIN units u ON a.unit_id = u.id
       WHERE u.module_id = m.id), 0) * 100 as progress
    FROM modules m ORDER BY m.sort_order
  `);
  res.json(modules.map((m: any) => ({
    ...m,
    progress: m.progress ? Math.round(Number(m.progress)) : 0,
  })));
});

router.get('/:id', async (req, res) => {
  const db = await getDb();
  const mod = queryOne(db, 'SELECT * FROM modules WHERE id = ?', [req.params.id]);
  if (!mod) return res.status(404).json({ error: 'Module not found' });

  const units = queryAll(db, `
    SELECT u.*,
      (SELECT COUNT(*) FROM user_progress up
       JOIN activities a ON up.activity_id = a.id
       WHERE a.unit_id = u.id AND up.completed = 1) * 1.0 /
      NULLIF((SELECT COUNT(*) FROM activities a WHERE a.unit_id = u.id), 0) * 100 as progress
    FROM units u WHERE u.module_id = ? ORDER BY u.sort_order
  `, [req.params.id]);

  res.json({ ...mod, units: units.map((u: any) => ({
    ...u,
    progress: u.progress ? Math.round(Number(u.progress)) : 0,
  })) });
});

export default router;
