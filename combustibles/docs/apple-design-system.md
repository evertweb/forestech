# Sistema de Diseño Apple - Combustibles App
## Rediseño UI/UX Completo

### 🎯 Objetivo
Transformar la aplicación de combustibles con un diseño completamente inspirado en Apple, implementando principios de diseño minimalista, elegante y funcional característicos de iOS/macOS.

---

## 🎨 Paleta de Colores Apple

### Colores Principales
```css
/* Grises Apple - Base del sistema */
--apple-gray-50: #fafafa;
--apple-gray-100: #f5f5f7;
--apple-gray-200: #e5e5e7;
--apple-gray-300: #d2d2d7;
--apple-gray-400: #86868b;
--apple-gray-500: #6e6e73;
--apple-gray-600: #515154;
--apple-gray-700: #424245;
--apple-gray-800: #1d1d1f;
--apple-gray-900: #000000;

/* Blancos Apple */
--apple-white: #ffffff;
--apple-off-white: #fbfbfd;

/* Azul Apple - Para elementos interactivos */
--apple-blue: #007aff;
--apple-blue-light: #5ac8fa;
--apple-blue-dark: #0051d5;

/* Verde Apple - Para estados positivos */
--apple-green: #34c759;
--apple-green-light: #30d158;
--apple-green-dark: #248a3d;

/* Rojo Apple - Para estados de error */
--apple-red: #ff3b30;
--apple-red-light: #ff453a;
--apple-red-dark: #d70015;

/* Naranja Apple - Para advertencias */
--apple-orange: #ff9500;
--apple-orange-light: #ff9f0a;
--apple-orange-dark: #c7750a;

/* Amarillo Apple - Para información */
--apple-yellow: #ffcc00;
--apple-yellow-light: #ffd60a;
--apple-yellow-dark: #c7a500;
```

### Colores Semánticos
```css
/* Backgrounds */
--bg-primary: var(--apple-white);
--bg-secondary: var(--apple-gray-50);
--bg-tertiary: var(--apple-gray-100);
--bg-elevated: var(--apple-white);
--bg-overlay: rgba(0, 0, 0, 0.4);

/* Text */
--text-primary: var(--apple-gray-800);
--text-secondary: var(--apple-gray-500);
--text-tertiary: var(--apple-gray-400);
--text-inverse: var(--apple-white);

/* Interactive */
--interactive-primary: var(--apple-blue);
--interactive-secondary: var(--apple-gray-300);
--interactive-success: var(--apple-green);
--interactive-warning: var(--apple-orange);
--interactive-error: var(--apple-red);

/* Borders */
--border-primary: var(--apple-gray-200);
--border-secondary: var(--apple-gray-300);
--border-focus: var(--apple-blue);
```

---

## 📝 Tipografía SF Pro

### Configuración de Fuentes
```css
/* SF Pro Display - Para títulos y headers */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

/* Fallback system fonts Apple */
--font-family-system: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif;
--font-family-display: 'Inter', var(--font-family-system);
--font-family-text: 'Inter', var(--font-family-system);
--font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
```

### Escala Tipográfica
```css
/* Display - Para títulos principales */
--font-size-display-large: 57px;
--font-size-display-medium: 45px;
--font-size-display-small: 36px;

/* Headlines - Para secciones */
--font-size-headline-large: 32px;
--font-size-headline-medium: 28px;
--font-size-headline-small: 24px;

/* Titles - Para cards y componentes */
--font-size-title-large: 22px;
--font-size-title-medium: 16px;
--font-size-title-small: 14px;

/* Body - Para contenido */
--font-size-body-large: 16px;
--font-size-body-medium: 14px;
--font-size-body-small: 12px;

/* Labels - Para etiquetas */
--font-size-label-large: 14px;
--font-size-label-medium: 12px;
--font-size-label-small: 11px;
```

### Pesos de Fuente
```css
--font-weight-thin: 100;
--font-weight-ultralight: 200;
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-heavy: 800;
--font-weight-black: 900;
```

---

## 📏 Espaciado Apple

### Sistema de Espaciado (8pt Grid)
```css
--spacing-1: 4px;   /* 0.25rem */
--spacing-2: 8px;   /* 0.5rem */
--spacing-3: 12px;  /* 0.75rem */
--spacing-4: 16px;  /* 1rem */
--spacing-5: 20px;  /* 1.25rem */
--spacing-6: 24px;  /* 1.5rem */
--spacing-8: 32px;  /* 2rem */
--spacing-10: 40px; /* 2.5rem */
--spacing-12: 48px; /* 3rem */
--spacing-16: 64px; /* 4rem */
--spacing-20: 80px; /* 5rem */
--spacing-24: 96px; /* 6rem */
```

### Espaciado Semántico
```css
--spacing-xs: var(--spacing-1);
--spacing-sm: var(--spacing-2);
--spacing-md: var(--spacing-4);
--spacing-lg: var(--spacing-6);
--spacing-xl: var(--spacing-8);
--spacing-2xl: var(--spacing-12);
--spacing-3xl: var(--spacing-16);
```

---

## 🔘 Bordes y Radios

### Border Radius Apple
```css
--radius-none: 0px;
--radius-xs: 4px;
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 20px;
--radius-3xl: 24px;
--radius-full: 9999px;

/* Radios específicos Apple */
--radius-card: var(--radius-lg);
--radius-button: var(--radius-md);
--radius-input: var(--radius-md);
--radius-modal: var(--radius-xl);
```

### Bordes
```css
--border-width-thin: 0.5px;
--border-width-normal: 1px;
--border-width-thick: 2px;
--border-width-heavy: 4px;
```

---

## 🌟 Sombras Apple

### Sistema de Elevación
```css
/* Sombras sutiles Apple */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Sombras específicas */
--shadow-card: var(--shadow-sm);
--shadow-modal: var(--shadow-xl);
--shadow-dropdown: var(--shadow-lg);
--shadow-button: var(--shadow-xs);
```

---

## 🎭 Animaciones y Transiciones

### Curvas de Animación Apple
```css
/* Easing curves Apple */
--ease-in-out-cubic: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out-cubic: cubic-bezier(0, 0, 0.2, 1);
--ease-in-cubic: cubic-bezier(0.4, 0, 1, 1);
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);

/* Duraciones */
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
--duration-slower: 500ms;

/* Transiciones comunes */
--transition-fast: all var(--duration-fast) var(--ease-out-cubic);
--transition-normal: all var(--duration-normal) var(--ease-out-cubic);
--transition-slow: all var(--duration-slow) var(--ease-out-cubic);
```

---

## 📱 Componentes Apple

### Cards
- **Background**: Blanco puro con sombra sutil
- **Border Radius**: 12px
- **Padding**: 16px - 24px
- **Sombra**: shadow-card
- **Hover**: Elevación sutil + escala 1.02

### Botones
- **Primary**: Azul Apple con texto blanco
- **Secondary**: Gris claro con texto oscuro
- **Destructive**: Rojo Apple
- **Border Radius**: 8px
- **Padding**: 8px 16px (small), 12px 24px (medium), 16px 32px (large)

### Inputs
- **Background**: Gris muy claro
- **Border**: Transparente, focus con azul Apple
- **Border Radius**: 8px
- **Padding**: 12px 16px

### Navegación
- **Estilo**: Tab bar iOS/macOS
- **Background**: Blanco con blur
- **Items**: Iconos + texto, estado activo con azul Apple
- **Separadores**: Líneas sutiles

---

## 🎯 Principios de Diseño Apple

### 1. Claridad
- Jerarquía visual clara
- Contenido legible y accesible
- Espaciado generoso

### 2. Deferencia
- La interfaz no compite con el contenido
- Colores sutiles y neutros
- Elementos funcionales discretos

### 3. Profundidad
- Capas visuales distintas
- Sombras sutiles para elevación
- Transiciones suaves entre estados

### 4. Consistencia
- Patrones de interacción familiares
- Elementos reutilizables
- Comportamiento predecible

---

## 📐 Layout y Grid

### Container Sizes
```css
--container-xs: 480px;
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### Grid System
- **Columnas**: 12 columnas flexibles
- **Gutters**: 16px (mobile), 24px (tablet), 32px (desktop)
- **Margins**: 16px (mobile), 32px (tablet), 64px (desktop)

---

## 🔧 Implementación

### Archivos a Crear/Modificar
1. `src/styles/apple-design-system.css` - Variables y tokens
2. `src/styles/apple-components.css` - Componentes base
3. `src/styles/apple-layout.css` - Layout y grid
4. `src/styles/apple-animations.css` - Animaciones y transiciones

### Orden de Implementación
1. ✅ Sistema de design tokens
2. 🔄 Tipografía SF Pro
3. 🔄 Navegación principal
4. 🔄 Layout del Dashboard
5. 🔄 Componentes base (cards, botones)
6. 🔄 Micro-interacciones
7. 🔄 Secciones específicas (Inventario, Movimientos)

---

## 📱 Responsive Design

### Breakpoints Apple
```css
--breakpoint-sm: 640px;   /* iPhone */
--breakpoint-md: 768px;   /* iPad Portrait */
--breakpoint-lg: 1024px;  /* iPad Landscape */
--breakpoint-xl: 1280px;  /* Desktop */
--breakpoint-2xl: 1536px; /* Large Desktop */
```

### Adaptaciones por Dispositivo
- **Mobile**: Navegación bottom tab, cards full-width
- **Tablet**: Navegación lateral, grid 2-3 columnas
- **Desktop**: Navegación top/side, grid 3-4 columnas

---

Este sistema de diseño Apple será la base para transformar completamente la aplicación de combustibles, manteniendo la funcionalidad existente pero con una experiencia visual y de usuario completamente renovada.