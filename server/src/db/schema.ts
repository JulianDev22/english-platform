import initSqlJs, { type Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', '..', 'data.db');

let db: Database;

function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

export async function getDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA journal_mode=WAL');
  return db;
}

export function saveDatabase() {
  if (db) saveDb();
}

export async function initDb() {
  const db = await getDb();

  db.run(`
    CREATE TABLE IF NOT EXISTS modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number INTEGER NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT,
      description TEXT,
      duration_weeks TEXT,
      icon TEXT,
      sort_order INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS units (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER NOT NULL REFERENCES modules(id),
      number TEXT NOT NULL,
      title TEXT NOT NULL,
      objective TEXT,
      sort_order INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unit_id INTEGER NOT NULL REFERENCES units(id),
      title TEXT NOT NULL,
      content TEXT,
      sort_order INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unit_id INTEGER NOT NULL REFERENCES units(id),
      code TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      activity_type TEXT NOT NULL,
      config JSON,
      sort_order INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS flashcards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      activity_id INTEGER NOT NULL REFERENCES activities(id),
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      hints TEXT,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quiz_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      activity_id INTEGER NOT NULL REFERENCES activities(id),
      question TEXT NOT NULL,
      options JSON NOT NULL,
      correct_index INTEGER NOT NULL,
      explanation TEXT,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      activity_id INTEGER NOT NULL REFERENCES activities(id),
      completed INTEGER DEFAULT 0,
      score REAL,
      attempts INTEGER DEFAULT 0,
      last_attempt_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(activity_id)
    );

    CREATE TABLE IF NOT EXISTS user_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL
    );
  `);

  db.run(`INSERT OR IGNORE INTO user_settings (key, value) VALUES ('theme', 'dark')`);
  saveDb();
}

export async function seedModules() {
  const db = await getDb();

  const count = db.exec('SELECT COUNT(*) as count FROM modules');
  const row = count[0]?.values[0]?.[0] ?? 0;
  if (row > 0) return;

  const insertModule = db.prepare(`
    INSERT INTO modules (number, title, subtitle, description, duration_weeks, icon, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertUnit = db.prepare(`
    INSERT INTO units (module_id, number, title, objective, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertTopic = db.prepare(`
    INSERT INTO topics (unit_id, title, content, sort_order)
    VALUES (?, ?, ?, ?)
  `);

  const insertActivity = db.prepare(`
    INSERT INTO activities (unit_id, code, title, description, activity_type, config, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertFlashcard = db.prepare(`
    INSERT INTO flashcards (activity_id, front, back, hints, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertQuiz = db.prepare(`
    INSERT INTO quiz_questions (activity_id, question, options, correct_index, explanation, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertProgress = db.prepare(`
    INSERT OR IGNORE INTO user_progress (activity_id, completed, score, attempts) VALUES (?, 0, null, 0)
  `);

  try {
    db.run('BEGIN TRANSACTION');

    // ===== MÓDULO 0 =====
    insertModule.run([0, 'Fundamentos y Mentalidad', 'Pre-A1',
      'Construir la base metodológica y fonética antes de aprender vocabulario o gramática',
      '2–3 semanas', '🧠', 0]);
    const mod0Id = 1;

    // --- Unidad 0.1 ---
    insertUnit.run([mod0Id, '0.1', 'Mentalidad y Metodología del Aprendizaje',
      'Establecer la mentalidad correcta y las herramientas para aprender inglés de manera efectiva', 0]);
    const u01Id = 1;

    insertTopic.run([u01Id, '¿Cuánto tiempo se tarda en llegar a B1?',
      '• Tabla: horas necesarias según dedicación diaria\n• Estimación realista para 1 año de estudio\n• Regla: frecuencia > duración', 0]);
    insertTopic.run([u01Id, 'El Método del Input Comprensible — Teoría de Krashen',
      'Hipótesis 1: Adquisición vs Aprendizaje\nHipótesis 2: El Input Comprensible (i+1)\nHipótesis 3: El Monitor gramatical\nHipótesis 4: El Filtro Afectivo', 1]);
    insertTopic.run([u01Id, 'El Periodo de Silencio',
      'Por qué es normal no hablar al principio\nInput antes de output\nError del método tradicional', 2]);
    insertTopic.run([u01Id, 'Rutina de Estudio Efectiva',
      'Frecuencia vs duración — la ciencia detrás\nPlan semanal modelo (distribución por habilidad)\nIntegrar el inglés en la vida diaria sin "estudiar"', 3]);
    insertTopic.run([u01Id, 'Spaced Repetition — La Ciencia de No Olvidar',
      'Cómo funciona el algoritmo SM-2 de Anki\nSistema de calificación: Again / Hard / Good / Easy\nMeta de vocabulario: 2,000–3,000 palabras para B1\nPlan: 10 palabras nuevas/día → 2,000 en 7 meses', 4]);

    insertActivity.run([u01Id, 'ACT 0.1.A', 'Mi Contrato de Aprendizaje',
      'Escribe tu meta específica con fecha y razón personal. Lista 5+ razones emocionales para aprender inglés.',
      'writing', '{"prompt":"Escribe tu contrato de aprendizaje","min_words":50}', 0]);
    insertActivity.run([u01Id, 'ACT 0.1.B', 'Setup de Herramientas',
      'Configura tu ecosistema de aprendizaje. Instala herramientas recomendadas.',
      'writing', '{"prompt":"Lista de herramientas instaladas","min_words":30}', 1]);
    insertActivity.run([u01Id, 'ACT 0.1.C', 'Plan Semanal Personalizado',
      'Mapea tus horarios. Asigna habilidades a cada ventana. Meta: mínimo 6 horas semanales.',
      'writing', '{"prompt":"Diseña tu plan semanal","min_words":30}', 2]);

    // --- Unidad 0.2 ---
    insertUnit.run([mod0Id, '0.2', 'El Alfabeto Inglés',
      'Aprender el alfabeto inglés y la habilidad de deletrear correctamente', 1]);
    const u02Id = 2;

    insertTopic.run([u02Id, 'Las 26 Letras — Pronunciación Completa',
      'Nombre de cada letra con su transcripción fonética. Letras más traicioneras: A /eɪ/, E /iː/, G /dʒiː/, H /eɪtʃ/, I /aɪ/, J /dʒeɪ/, O /oʊ/, U /juː/, V /viː/, W /ˈdʌbljuː/, Y /waɪ/, Z /ziː/ o /zed/',
      0]);
    insertTopic.run([u02Id, 'Deletrear (Spelling)',
      'Frases clave: "Could you spell that?", "How do you spell...?". Mayúsculas vs minúsculas.', 1]);
    insertTopic.run([u02Id, 'El Alfabeto Fonético NATO',
      'Para qué sirve. Las 26 palabras y su pronunciación aproximada.', 2]);

    insertActivity.run([u02Id, 'ACT 0.2.A', 'El Alfabeto de Memoria (3 Niveles)',
      'Nivel 1: cantar la canción del alfabeto.\nNivel 2: decirlo solo cronometrado (meta: bajo 30 seg).\nNivel 3: decirlo al revés (Z → A).',
      'quiz', '{"randomize_questions":true,"randomize_options":true,"passing_score":80,"max_attempts":3}', 0]);

    insertQuiz.run([3, '¿Cómo se pronuncia la letra "A" en inglés?',
      '["/a/","/eɪ/","/ei/","/aɪ/"]', 1, 'La A en inglés se pronuncia /eɪ/, como el diptongo "ei".', 0]);
    insertQuiz.run([3, '¿Cómo se pronuncia la letra "E" en inglés?',
      '["/e/","/iː/","/ɪ/","/ei/"]', 1, 'La E en inglés es /iː/, suena como "i" larga.', 1]);
    insertQuiz.run([3, '¿Cómo se pronuncia la letra "H" en inglés?',
      '["/h/","/eɪtʃ/","/atʃ/","/xe/"]', 1, 'La H tiene el nombre completo /eɪtʃ/, "eitsch".', 2]);
    insertQuiz.run([3, '¿Cómo se pronuncia la letra "W" en inglés?',
      '["/w/","/dabliu/","/ˈdʌbljuː/","/we/"]', 2, 'La W se pronuncia /ˈdʌbljuː/, "double-u".', 3]);
    insertQuiz.run([3, '¿Cuál letra tiene pronunciación diferente en inglés americano vs británico?',
      '["A","Z","R","Q"]', 1, 'La Z es /ziː/ en americano y /zed/ en británico.', 4]);

    insertActivity.run([u02Id, 'ACT 0.2.B', 'Deletreo Personal de Memoria',
      'Aprende y practica: nombre completo, email, ciudad. Meta: menos de 20 segundos.',
      'writing', '{"prompt":"Practica deletrear tu información personal","min_words":20}', 1]);
    insertActivity.run([u02Id, 'ACT 0.2.C', 'Reto de Dictado de Palabras',
      'Escucha y deletrea. Practica siglas (NBA, USA, FBI, CEO).',
      'dictation', '{}', 2]);

    // --- Unidad 0.3 ---
    insertUnit.run([mod0Id, '0.3', 'Sistema Fonético del Inglés — Los Sonidos',
      'Familiarizarse con los sonidos del inglés, especialmente los que no existen en español', 2]);
    const u03Id = 3;

    insertTopic.run([u03Id, 'El IPA — El Mapa Secreto de los Sonidos',
      'Qué es el Alfabeto Fonético Internacional. Cómo leer IPA en un diccionario.', 0]);
    insertTopic.run([u03Id, 'Las Vocales del Inglés — 20 sonidos vs 5 del español',
      'Vocales cortas: /ɪ/ (sit), /e/ (bed), /æ/ (cat), /ʌ/ (cup), /ʊ/ (book), /ɒ/ (hot).\nVocales largas: /iː/ (see), /ɑː/ (car), /ɔː/ (all), /uː/ (food), /ɜː/ (bird).\nEl Schwa /ə/',
      1]);
    insertTopic.run([u03Id, 'Los Sonidos Más Difíciles para Mexicanos',
      'TH sordo /θ/ (think), TH sonoro /ð/ (the), V labidental /v/, W /w/, R retroflexa /r/, H aspirada /h/, NG /ŋ/, Z sonora /z/.',
      2]);
    insertTopic.run([u03Id, 'El Schwa /ə/ — El Sonido Más Importante',
      'Sonido vocal neutro. Aparece en TODAS las sílabas no acentuadas. about, teacher, doctor.', 3]);

    // Flashcards activity
    insertActivity.run([u03Id, 'ACT 0.3.A', 'Flashcards — Los Sonidos del Inglés',
      'Aprende los sonidos más importantes del inglés con flashcards interactivas.',
      'flashcard', '{"shuffle":true}', 0]);
    const fcId = 6;

    const flashcards = [
      ['/θ/ — ¿Cómo suena? Piensa en "think"', 'TH sordo. Lengua entre dientes, soplar SIN vibrar.', 'Pon la lengua entre los dientes y sopla'],
      ['/ð/ — ¿Cómo suena? Piensa en "the"', 'TH sonoro. Misma posición que /θ/ pero CON vibración.', 'Mano en la garganta para sentir la vibración'],
      ['/æ/ — ¿Cómo suena? Piensa en "cat"', 'Sonido entre "a" y "e". Boca abierta, lengua plana.', 'Di "a" pero con la boca más abierta'],
      ['/ɪ/ vs /iː/ — ¿Cuál es la diferencia?', '/ɪ/ es corta (ship). /iː/ es larga y tensa (sheep).', 'La diferencia cambia el significado'],
      ['Schwa /ə/ — ¿Dónde aparece?', 'En TODAS las sílabas NO acentuadas. about → /əˈbaʊt/', 'Es el sonido más común del inglés'],
      ['/v/ — ¿Cómo es diferente de /b/?', '/v/ es labidental. /b/ es bilabial.', 'Muerde tu labio inferior suavemente'],
      ['¿El inglés es stress-timed o syllable-timed?', 'Stress-timed (acentual). Español es syllable-timed.', 'Las sílabas no acentuadas se comprimen'],
    ];
    flashcards.forEach((fc, i) => {
      insertFlashcard.run([fcId, ...fc, i]);
    });

    // Minimal Pairs quiz
    insertActivity.run([u03Id, 'ACT 0.3.B', 'Minimal Pairs — Entrenamiento del Oído',
      'Practica /ɪ/ vs /iː/, /æ/ vs /e/, /v/ vs /b/.',
      'quiz', '{"randomize_questions":true,"randomize_options":true,"passing_score":80,"max_attempts":3}', 1]);
    const quizId = 7;

    insertQuiz.run([quizId, '¿Cuál palabra tiene el sonido /ɪ/ (corto)?',
      '["sheep","ship","see","seat"]', 1, 'Ship tiene /ɪ/. Sheep tiene /iː/.', 0]);
    insertQuiz.run([quizId, '¿Cuál par tiene sonidos diferentes?',
      '["bad - bed","man - men","pan - pen","Todas las anteriores"]', 3, 'Todos son pares mínimos.', 1]);
    insertQuiz.run([quizId, 'Para pronunciar /v/ correctamente...',
      '["Junto ambos labios","Labio inferior + dientes superiores","Lengua entre dientes","Vibro la garganta"]', 1, '/v/ es labidental.', 2]);

    insertActivity.run([u03Id, 'ACT 0.3.C', 'Shadowing Básico',
      'Elige material en inglés (30-60s). Escucha, repite imitando ritmo y tono. Grábate.',
      'audio', '{}', 2]);

    insertActivity.run([u03Id, 'ACT 0.3.D', 'El Schwa Hunt',
      'Identifica el Schwa en un texto. Marca sílabas con /ə/. Lee en voz alta.',
      'fill-blanks',
      '{"blanks":[{"before":"The","after":"is a very important sound.","answer":"schwa"},{"before":"The symbol for schwa is","after":"","answer":"/ə/"},{"before":"Schwa appears in","after":"syllables.","answer":"unstressed"}]}',
      3]);

    // Progress entries for all activities (3 + 5 + 5 activities = 8 total in module 0)
    for (let i = 3; i <= 8; i++) {
      insertProgress.run([i]);
    }

    db.run('COMMIT');
    saveDb();
    console.log('Database seeded successfully');
  } catch (err) {
    db.run('ROLLBACK');
    console.error('Seed failed:', err);
    throw err;
  }
}
