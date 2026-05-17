import { Router } from 'express';
import { getDb, saveDatabase } from '../db/schema.js';
import { queryAll, runStmt } from '../db/helpers.js';

const router = Router();

router.get('/', async (_req, res) => {
  const db = await getDb();
  const rows = queryAll(db, 'SELECT key, value FROM user_settings');
  const obj: Record<string, string> = {};
  for (const s of rows) obj[s.key as string] = s.value as string;
  res.json(obj);
});

router.put('/', async (req, res) => {
  const db = await getDb();
  const { theme } = req.body;
  if (theme) {
    runStmt(db, "UPDATE user_settings SET value = ? WHERE key = 'theme'", [theme]);
    saveDatabase();
  }
  const rows = queryAll(db, 'SELECT key, value FROM user_settings');
  const obj: Record<string, string> = {};
  for (const s of rows) obj[s.key as string] = s.value as string;
  res.json(obj);
});

export default router;
