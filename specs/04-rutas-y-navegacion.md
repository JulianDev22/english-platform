# Rutas y Navegación

## Estructura de React Router

```tsx
<Routes>
  <Route element={<AppLayout />}>
    {/* Dashboard */}
    <Route index element={<Dashboard />} />

    {/* Módulos */}
    <Route path="modulo/:moduleNumber" element={<ModulePage />} />

    {/* Unidades */}
    <Route path="modulo/:moduleNumber/unidad/:unitNumber" element={<UnitPage />} />

    {/* Actividades */}
    <Route path="modulo/:moduleNumber/unidad/:unitNumber/actividad/:activityId" element={<ActivityPage />} />

    {/* Progreso global */}
    <Route path="progreso" element={<ProgressPage />} />

    {/* Flashcards (reviews globales) */}
    <Route path="revisar" element={<ReviewPage />} />

    {/* Configuración */}
    <Route path="configuracion" element={<SettingsPage />} />
  </Route>

  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

## Lazy Loading
Cada página se carga con `React.lazy()` para splitting por módulo:

```tsx
const ModulePage = React.lazy(() => import('@/pages/ModulePage'));
const UnitPage = React.lazy(() => import('@/pages/UnitPage'));
```

## Sidebar: árbol de navegación
La sidebar representa la jerarquía completa:

```
📚 Módulo 0 — Fundamentos (Pre-A1)
  ├── 0.1 Mentalidad y Metodología
  │   ├── ACT 0.1.A — Mi Contrato de Aprendizaje
  │   ├── ACT 0.1.B — Setup de Herramientas
  │   └── ACT 0.1.C — Mi Plan Semanal
  ├── 0.2 El Alfabeto Inglés
  │   ├── ACT 0.2.A — El Alfabeto de Memoria
  │   ├── ACT 0.2.B — Deletreo Personal
  │   └── ACT 0.2.C — Reto de Dictado
  └── 0.3 Sistema Fonético
      ├── ACT 0.3.A — El Espejo del TH
      ├── ACT 0.3.B — Minimal Pairs
      ├── ACT 0.3.C — Shadowing Básico
      └── ACT 0.3.D — El Schwa Hunt

📚 Módulo 1 — A1 Principiante
  └── ...
```

- Módulos colapsables/expandibles.
- Cada item con indicador de progreso (círculo lleno/vacío/parcial).
- Scroll independiente del contenido.

## Breadcrumbs
```
Inicio > Módulo 1 > Unidad 1.1 > Actividad
```
Implementado con hook personalizado que lee el match de React Router.
