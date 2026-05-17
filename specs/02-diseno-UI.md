# Diseño de UI

## Inspiración estética
- **Apple**: Limpio, tipografía San Francisco/Inter, espaciado generoso, sombras sutiles.
- **Meta (Oculus)**: Bordes redondeados, glassmorphism sutil, dark mode profundo (#121212).
- **Minimalismo**: Sin ruido visual. El contenido es el protagonista.

## Paleta de colores

### Modo oscuro (default)
```
Fondo principal:  #0a0a0a (black)
Fondo secundario: #141414 (elevated)
Fondo terciario:  #1a1a1a (card)
Superficies:      #252525 (hovered)
Bordes:           #333333
Texto primario:   #f5f5f7 (white)
Texto secundario: #98989d (gray)
Acento:           #0071e3 (azul Apple/azul Meta)
Acento hover:     #0077ed
Error:            #ff453a
Success:          #30d158
Warning:          #ffd60a
```

### Modo claro
```
Fondo principal:  #ffffff
Fondo secundario: #f5f5f7
Fondo terciario:  #e8e8ed
Bordes:           #d2d2d7
Texto primario:   #1d1d1f
Texto secundario: #86868b
Acento:           #0071e3
```

## Tipografía
- **Fuente principal**: Inter (sistema), fallback system-ui, sans-serif.
- **Escala**: 14px (small), 16px (base), 20px (lg), 24px (xl), 32px (2xl), 48px (3xl).
- **Peso**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold).

## Componentes globales

### Sidebar
- Fija a la izquierda, 280px de ancho.
- Lista jerárquica: Módulo → Unidad → Actividad.
- Indicador de progreso visual (barra / círculo / check).
- Colapsable a iconos en mobile.

### Top bar
- Minimalista: logo, toggle tema, avatar/perfil.
- Breadcrumb de navegación en páginas internas.

### Tarjetas (Cards)
- Esquinas redondeadas (12px), fondo secundario, sombra mínima.
- Efecto hover: lift suave (translateY -2px + box-shadow).

### Botones
- Primario: fondo acento, texto blanco, border-radius 8px.
- Secundario: borde acento, texto acento, fondo transparente.
- Ghost: sin borde, solo texto, para acciones secundarias.

### Transiciones
- Dark/light mode: transición suave de 300ms en `background-color` y `color`.
- Navegación entre páginas: fade + slide suave (300ms, Framer Motion).
- Flashcards: flip 3D (600ms, rotateY).

## Layout general

```
+------------------+----------------------------------+
|                  |  Top Bar (breadcrumb + actions)  |
|   Sidebar        +----------------------------------+
|   (módulos,      |                                  |
|    unidades,     |    Contenido principal            |
|    actividades)  |    (scroll)                       |
|                  |                                  |
+------------------+----------------------------------+
```

En mobile: sidebar se convierte en drawer overlay.

## Responsive breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
