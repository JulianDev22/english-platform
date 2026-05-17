# English Learning Platform — De Cero a B1

Plataforma web personal e interactiva para aprender inglés de nivel cero a B1, basada en la guía definitiva estructurada en 7 módulos, 46 unidades y 120+ actividades.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Estilos | Tailwind CSS (modo oscuro nativo) |
| Routing | React Router v6 (lazy loading) |
| Estado global | Zustand |
| Animaciones | Framer Motion |
| Backend | Node.js + Express + better-sqlite3 |
| PWA | vite-plugin-pwa |
| Paquetería | pnpm |

## Estructura del Proyecto

```
english-platform/
├── client/                  # Frontend React
│   ├── public/              # Assets estáticos
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas/rutas
│   │   ├── store/           # Zustand stores
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilidades
│   │   ├── types/           # Tipos TypeScript
│   │   └── assets/          # Imágenes, iconos
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── server/                  # Backend Express
│   ├── src/
│   │   ├── routes/
│   │   ├── db/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── specs/                   # Documentación de especificaciones
```

## Cómo iniciar

```bash
pnpm install          # Instalar dependencias
pnpm dev              # Iniciar frontend + backend concurrentemente
pnpm build            # Build producción
```
