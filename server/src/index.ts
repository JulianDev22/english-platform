import express from 'express';
import cors from 'cors';
import { initDb, seedModules } from './db/schema.js';
import modulesRouter from './routes/modules.js';
import unitsRouter from './routes/units.js';
import activitiesRouter from './routes/activities.js';
import flashcardsRouter from './routes/flashcards.js';
import quizRouter from './routes/quiz.js';
import progressRouter from './routes/progress.js';
import settingsRouter from './routes/settings.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize DB
initDb().then(() => {
  seedModules().then(() => {
    console.log('Database ready');
  });
});

// Routes
app.use('/api/modules', modulesRouter);
app.use('/api/units', unitsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/flashcards', flashcardsRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/progress', progressRouter);
app.use('/api/settings', settingsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
