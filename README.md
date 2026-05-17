# English Platform — De Cero a B1

Plataforma web interactiva para aprender inglés desde nivel cero hasta B1. Diseñada específicamente para hispanohablantes mexicanos, con actividades integradas (flashcards, quizzes, ejercicios) y seguimiento de progreso.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Estilos | Tailwind CSS v4 (modo oscuro) |
| Routing | React Router v6 (lazy loading) |
| Estado | Zustand |
| Animaciones | Framer Motion |
| Backend | Node.js + Express |
| BD | SQLite (sql.js — sin dependencias nativas) |
| Paquetería | pnpm |

## Requisitos

- **Node.js** >= 18 (recomendado 20+)
- **pnpm** — Instalar con: `npm install -g pnpm`

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/JulianDev22/english-platform.git
cd english-platform

# Instalar todas las dependencias
pnpm install
```

## Desarrollo

```bash
# Iniciar backend y frontend simultáneamente
pnpm dev

# O por separado (terminales distintas):
pnpm server     # Backend en http://localhost:3001
pnpm client     # Frontend en http://localhost:5173
```

El frontend tiene un proxy configurado hacia el backend, así que las llamadas `/api/*` se redirigen automáticamente.

## Build producción

```bash
pnpm build
```

Esto compila el frontend en `client/dist/` y el backend en `server/dist/`.

Para servir en producción, ejecutar:

```bash
cd server
pnpm start
```

Y servir `client/dist/` con cualquier servidor estático (nginx, serve, etc.).

## Estructura del proyecto

```
english-platform/
├── specs/           # Documentación de especificaciones
├── client/          # Frontend React
│   └── src/
│       ├── components/
│       │   ├── ui/          # Primitivas (Button, Card, etc.)
│       │   ├── layout/      # Sidebar, TopBar, AppLayout
│       │   └── activities/  # Flashcards, Quiz, FillBlanks...
│       ├── pages/           # Dashboard, ModulePage, UnitPage...
│       ├── store/           # Zustand store
│       ├── lib/             # API client
│       └── types/           # TypeScript types
├── server/          # Backend Express + SQLite
│   └── src/
│       ├── db/              # Schema + seed data
│       └── routes/          # API endpoints REST
└── package.json     # Workspace root
```

## Funcionalidades incluidas

- **Dashboard** con progreso global
- **Sidebar** navegable con módulos/unidades/actividades
- **Flashcards** con animación 3D flip y sistema de ratings (SM-2)
- **Quizzes** de opción múltiple con feedback inmediato
- **Rellenar espacios** con auto-corrección
- **Ejercicios de escritura** con rúbrica
- **Modo oscuro/claro** con paleta estética Apple/Meta
- **Progreso persistente** en SQLite
- **Actividades de audio, dictado y roleplay** (esqueleto listo para completar)

## Próximos pasos

- [ ] PWA (service worker + manifest)
- [ ] Contenido completo Módulo 1 (A1) — 12 unidades
- [ ] Contenido completo Módulo 2 (A2) — 11 unidades
- [ ] Contenido completo Módulo 3 (B1) — 18 unidades
- [ ] Módulo Especial — Inglés para Mexicanos
- [ ] Módulo 5 — Evaluación y Examen B1
