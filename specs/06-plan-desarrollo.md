# Plan de Desarrollo Incremental

## Fase 0 — Fundación (Sprint 1)

**Objetivo**: Andamio completo del proyecto funcional.

- [x] Crear specs/ con documentación
- [ ] Scaffold proyecto Vite + React + TypeScript
- [ ] Configurar Tailwind CSS con modo oscuro
- [ ] Setup React Router con lazy loading
- [ ] Configurar Zustand stores base
- [ ] Crear layout: Sidebar + TopBar + MainContent
- [ ] Theme toggle (dark/light) con persistencia
- [ ] Backend Express + SQLite schema
- [ ] API endpoints: módulos, unidades, actividades (CRUD)
- [ ] PWA: manifest + service worker básico
- [ ] Poblar DB con Módulo 0 (3 unidades, 9 actividades)
- [ ] Dashboard básico con cards de módulos

## Fase 1 — Módulo 0 (Sprint 2)

**Objetivo**: Módulo 0 completamente funcional con actividades interactivas.

- [ ] Página de módulo (ModulePage)
- [ ] Página de unidad (UnitPage) con subtemas
- [ ] FlashcardsActivity (con SM-2 y flip 3D)
- [ ] QuizActivity (multiple choice)
- [ ] FillBlanksActivity
- [ ] MatchingActivity
- [ ] DictationActivity (sin audio real, con input/output)
- [ ] Sistema de progreso (completado + score)
- [ ] Persistencia de progreso vía API

## Fase 2 — Módulo 1 A1 (Sprint 3)

**Objetivo**: Módulo 1 completo (12 unidades, ~30 actividades).

- [ ] Crear todas las unidades y actividades del Módulo 1
- [ ] Poblar DB con contenido completo
- [ ] Afinar UX de actividades con feedback del usuario
- [ ] ReviewPage global (flashcards atrasados SRS)

## Fase 3 — Módulo 2 A2 (Sprint 4)

- [ ] Módulo 2 completo (11 unidades, ~20 actividades)
- [ ] AudioActivity con grabación (MediaRecorder)
- [ ] RoleplayActivity con diálogos ramificados
- [ ] Página de progreso global con estadísticas

## Fase 4 — Módulo 3 B1 (Sprint 5-6)

- [ ] Módulo 3 completo (18 unidades, ~40 actividades)
- [ ] WritingActivity con editor y rúbrica
- [ ] Mejoras: analytics, streak tracking, XP system

## Fase 5 — Módulo Especial + Examen (Sprint 7)

- [ ] Módulo Especial (Inglés para Mexicanos)
- [ ] Módulo 5 (Evaluación y Examen B1)
- [ ] Simulacro de examen completo con timer
- [ ] Apéndices y recursos

## Fase 6 — Pulido (Sprint 8)

- [ ] Animaciones y micro-interacciones
- [ ] Testing
- [ ] Performance optimization
- [ ] PWA advanced: sync offline progress
- [ ] SEO básico (meta tags)
