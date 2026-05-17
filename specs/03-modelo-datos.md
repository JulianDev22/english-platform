# Modelo de Datos

## SQLite Schema

### Tabla: modules
```sql
CREATE TABLE modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  number INTEGER NOT NULL,          -- 0, 1, 2, 3, especial, 5
  title TEXT NOT NULL,              -- "Fundamentos y Mentalidad"
  subtitle TEXT,                    -- "Pre-A1"
  description TEXT,
  duration_weeks TEXT,              -- "2–3 semanas"
  icon TEXT,                        -- nombre del icono
  sort_order INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
```

### Tabla: units
```sql
CREATE TABLE units (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  module_id INTEGER NOT NULL REFERENCES modules(id),
  number TEXT NOT NULL,             -- "0.1", "1.1", "2.3", etc.
  title TEXT NOT NULL,
  objective TEXT,
  sort_order INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
```

### Tabla: topics (subtemas)
```sql
CREATE TABLE topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  unit_id INTEGER NOT NULL REFERENCES units(id),
  title TEXT NOT NULL,              -- "El Alfabeto Inglés"
  content TEXT,                     -- Markdown del contenido
  sort_order INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
```

### Tabla: activities
```sql
CREATE TABLE activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  unit_id INTEGER NOT NULL REFERENCES units(id),
  code TEXT NOT NULL,               -- "ACT 0.2.A"
  title TEXT NOT NULL,
  description TEXT,                 -- Markdown con instrucciones
  activity_type TEXT NOT NULL,      -- 'flashcard' | 'quiz' | 'roleplay' | 'writing' | 'audio' | 'fill-blanks' | 'matching' | 'dictation'
  config JSON,                      -- Config específica del tipo de actividad
  sort_order INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
```

### Tabla: user_progress
```sql
CREATE TABLE user_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  completed INTEGER DEFAULT 0,     -- 0 = pending, 1 = completed
  score REAL,                       -- puntuación 0-100 (nullable)
  attempts INTEGER DEFAULT 0,
  last_attempt_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(activity_id)
);
```

### Tabla: user_flashcard_reviews (SRS)
```sql
CREATE TABLE user_flashcard_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  flashcard_id INTEGER NOT NULL REFERENCES flashcards(id),
  ease_factor REAL DEFAULT 2.5,     -- SM-2 algorithm
  interval INTEGER DEFAULT 0,       -- días hasta próximo repaso
  repetitions INTEGER DEFAULT 0,
  next_review_at TEXT,
  last_reviewed_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

### Tabla: flashcards
```sql
CREATE TABLE flashcards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  hints TEXT,                       -- pista opcional
  sort_order INTEGER NOT NULL
);
```

### Tabla: quiz_questions
```sql
CREATE TABLE quiz_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  question TEXT NOT NULL,
  options JSON,                     -- ["opcion1", "opcion2", "opcion3", "opcion4"]
  correct_index INTEGER NOT NULL,
  explanation TEXT,
  sort_order INTEGER NOT NULL
);
```

## Tipos JSON para config de actividades

### activity_type = 'flashcard'
```json
{
  "shuffle": true,
  "show_hints": true
}
```

### activity_type = 'quiz'
```json
{
  "randomize_questions": true,
  "randomize_options": true,
  "passing_score": 80,
  "max_attempts": 3
}
```

### activity_type = 'fill-blanks'
```json
{
  "show_hints": true,
  "case_sensitive": false
}
```

### activity_type = 'matching'
```json
{
  "pairs": [
    {"left": "hello", "right": "hola"},
    {"left": "goodbye", "right": "adiós"}
  ]
}
```

### activity_type = 'writing'
```json
{
  "prompt": "Write a paragraph...",
  "min_words": 50,
  "show_rubric": true
}
```

## API Endpoints

```
GET    /api/modules              # Todos los módulos con progreso
GET    /api/modules/:id          # Módulo con unidades
GET    /api/units/:id            # Unidad con temas y actividades
GET    /api/activities/:id       # Actividad con su data específica

POST   /api/progress/:activity   # Guardar progreso de actividad
GET    /api/progress             # Obtener progreso global

GET    /api/flashcards/:activity # Flashcards de una actividad
POST   /api/flashcards/review    # Guardar resultado de review SRS

GET    /api/quiz/:activity       # Preguntas de quiz
POST   /api/quiz/submit          # Enviar respuestas y calificar

GET    /api/settings             # Configuración del usuario
PUT    /api/settings             # Actualizar configuración
```
