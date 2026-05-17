# Componentes y Actividades Interactivas

## Árbol de Componentes Principal

```
App
├── ThemeProvider          (contexto de tema oscuro/claro)
├── Router
│   └── AppLayout
│       ├── Sidebar
│       │   ├── SidebarItem (módulo colapsable)
│       │   │   └── UnitItem
│       │   │       └── ActivityItem
│       │   └── ProgressSummary
│       ├── TopBar
│       │   ├── Breadcrumbs
│       │   ├── ThemeToggle
│       │   └── ProgressBadge
│       └── MainContent
│           ├── Dashboard
│           ├── ModulePage
│           ├── UnitPage
│           └── ActivityRouter
│               ├── FlashcardsActivity
│               ├── QuizActivity
│               ├── FillBlanksActivity
│               ├── MatchingActivity
│               ├── WritingActivity
│               ├── DictationActivity
│               └── RoleplayActivity
```

## Componentes Base (UI primitives)

### `Card`
Props: `title`, `subtitle`, `icon`, `progress?`, `href?`, `children`

### `Button`
Variantes: `primary`, `secondary`, `ghost`, `danger`
Props: `size` (sm, md, lg), `loading`, `disabled`, `icon`

### `ProgressBar`
Props: `value` (0-100), `size` (sm, md), `label?`, `animated?`

### `Badge`
Props: `variant` (success, warning, error, info), `size`

### `Modal`
Props: `open`, `onClose`, `title`, `size` (sm, md, lg, full)

---

## Actividades Interactivas

### 1. FlashcardsActivity
- Muestra tarjetas con frente/back.
- Click o tap para voltear (animación 3D flip).
- Botones: "Again" / "Hard" / "Good" / "Easy" (algoritmo SM-2).
- Barra de progreso del deck actual.
- Modal al completar: estadísticas de la sesión.
- **Estado**: `reviewing` → `flipped` → `rating`.

### 2. QuizActivity
- Múltiple opción (1 correcta de 4).
- Feedback inmediato: correcto (verde + explicación) / incorrecto (rojo + respuesta correcta).
- Timer opcional.
- Resultado final: score, tiempo, desglose por pregunta.
- **Estado**: `answering` → `feedback` → `finished`.

### 3. FillBlanksActivity
- Frase con espacios en blanco. Input del usuario.
- Auto-corrección: resaltar errores en rojo, aciertos en verde.
- Hint: botón para revelar una letra.
- **Estado**: `writing` → `checking` → `finished`.

### 4. MatchingActivity
- Dos columnas: conceptos y definiciones.
- Arrastrar línea / click-pareja.
- Feedback: pares correctos se fijan en verde, incorrectos se sacuden.
- **Estado**: `matching` → `feedback` → `finished`.

### 5. WritingActivity
- Editor de texto simple con prompt y contador de palabras.
- Rúbrica visible (criterios de evaluación).
- Checkbox de auto-evaluación vs rúbrica.
- Expansión de contracciones: Grammarly-like hints.

### 6. DictationActivity
- Audio player (text-to-speech o audio precargado).
- Input de texto para transcribir.
- Corrección: comparar texto ingresado vs transcript.
- Highlight de diferencias.

### 7. RoleplayActivity
- Diálogo guionizado con pasos.
- Cada paso muestra frase del "otro" personaje.
- Usuario elige o escribe su respuesta entre opciones.
- Flujo: el diálogo avanza según las elecciones.

### 8. AudioActivity (pronunciación)
- Texto a leer en voz alta.
- Grabación con MediaRecorder API.
- Playback para auto-evaluación.
- (Futuro: comparación con waveform nativa)

## Estado compartido (Zustand)

```ts
interface AppStore {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  progress: Record<number, ActivityProgress>;
  activeModule: number | null;
  activeUnit: string | null;
}
```
