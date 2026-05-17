# Arquitectura del Sistema

## Stack técnico

### Frontend
- **React 18 + TypeScript**: Componentes funcionales con tipado fuerte.
- **Vite**: Build tool ultrarrápida, HMR instantáneo, tree-shaking nativo.
- **Tailwind CSS**: Utility-first CSS. Modo oscuro con clase `dark` en `<html>`.
- **React Router v6**: Navegación anidada, lazy loading por módulo.
- **Zustand**: Estado global mínimo (progreso, tema, configuración).
- **Framer Motion**: Animaciones para transiciones, flip de flashcards, modales.

### Backend
- **Node.js + Express**: API REST ligera.
- **better-sqlite3**: SQLite síncrono, cero configuración, portable.
- **Estructura**: API RESTful con rutas por recurso.

### PWA
- **vite-plugin-pwa**: Service worker generado automáticamente.
- Cacheo de assets estáticos para funcionamiento offline parcial.
- Manifest para instalación en dispositivo.

## Principios de diseño

1. **Offline-first**: El contenido de los módulos debe poder consultarse sin conexión.
2. **Mobile-first**: Diseño responsive, PWA para instalar en móvil.
3. **Rendimiento**: Lazy loading de módulos, bundle splitting por ruta.
4. **Accesibilidad**: Contraste suficiente, etiquetas semánticas, navegación por teclado.

## Flujo de datos

```
Usuario → React (SPA) → API REST (Express) → SQLite
                        ↑
                  Service Worker (PWA cache)
```

- El progreso se persiste vía API a SQLite.
- Los módulos/unidades/actividades se sirven desde SQLite y se cachean en el SW.
- Estado de UI (tema, sidebar abierta) se maneja con Zustand.
