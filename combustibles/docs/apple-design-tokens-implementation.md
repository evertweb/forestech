# Implementación de Design Tokens Apple - Plan Técnico Detallado

## 📋 Archivos a Crear/Modificar

### 1. Sistema de Design Tokens Base
**Archivo**: `src/styles/apple-design-system.css`
- Variables CSS para colores, tipografía, espaciado
- Sistema de tokens Apple completo
- Reemplazo del sistema actual de colores

### 2. Componentes Base Apple
**Archivo**: `src/styles/apple-components.css`
- Estilos para cards, botones, inputs estilo Apple
- Componentes reutilizables
- Estados hover, focus, active

### 3. Layout Apple
**Archivo**: `src/styles/apple-layout.css`
- Grid system Apple
- Containers y espaciado
- Responsive breakpoints

### 4. Animaciones Apple
**Archivo**: `src/styles/apple-animations.css`
- Transiciones suaves
- Micro-interacciones
- Curvas de animación Apple

---

## 🎨 Design Tokens Detallados

### Colores Apple (Variables CSS)
```css
:root {
  /* === GRISES APPLE === */
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

  /* === COLORES SISTEMA APPLE === */
  --apple-white: #ffffff;
  --apple-blue: #007aff;
  --apple-green: #34c759;
  --apple-red: #ff3b30;
  --apple-orange: #ff9500;
  --apple-yellow: #ffcc00;

  /* === MAPEO SEMÁNTICO === */
  --bg-primary: var(--apple-white);
  --bg-secondary: var(--apple-gray-50);
  --bg-tertiary: var(--apple-gray-100);
  --text-primary: var(--apple-gray-800);
  --text-secondary: var(--apple-gray-500);
  --interactive-primary: var(--apple-blue);
  --interactive-success: var(--apple-green);
  --interactive-warning: var(--apple-orange);
  --interactive-error: var(--apple-red);
}
```

### Tipografía SF Pro
```css
/* Importar Inter como fallback de SF Pro */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

:root {
  --font-family-system: -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif;
  
  /* Escala tipográfica Apple */
  --font-size-display-large: 57px;
  --font-size-headline-large: 32px;
  --font-size-title-large: 22px;
  --font-size-body-large: 16px;
  --font-size-body-medium: 14px;
  --font-size-label-large: 14px;
  
  /* Pesos Apple */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### Espaciado Apple (8pt Grid)
```css
:root {
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
}
```

### Bordes y Sombras Apple
```css
:root {
  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* Sombras sutiles Apple */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Transiciones Apple */
  --ease-out-cubic: cubic-bezier(0, 0, 0.2, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --transition-fast: all var(--duration-fast) var(--ease-out-cubic);
  --transition-normal: all var(--duration-normal) var(--ease-out-cubic);
}
```

---

## 🧩 Componentes Apple

### Cards Apple
```css
.apple-card {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-6);
  transition: var(--transition-normal);
  border: 1px solid var(--apple-gray-200);
}

.apple-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

### Botones Apple
```css
.apple-button {
  font-family: var(--font-family-system);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  transition: var(--transition-fast);
  border: none;
  cursor: pointer;
}

.apple-button-primary {
  background: var(--interactive-primary);
  color: var(--apple-white);
}

.apple-button-secondary {
  background: var(--apple-gray-100);
  color: var(--text-primary);
}
```

### Navegación Apple
```css
.apple-navigation {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--apple-gray-200);
  padding: var(--spacing-2) 0;
}

.apple-nav-item {
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
  color: var(--text-secondary);
}

.apple-nav-item.active {
  background: var(--interactive-primary);
  color: var(--apple-white);
}
```

---

## 📱 Navegación Estilo iOS/macOS

### Estructura Propuesta
```jsx
// MainNavigation rediseñada
<nav className="apple-navigation">
  <div className="apple-nav-container">
    {tabs.map(tab => (
      <button 
        key={tab.id}
        className={`apple-nav-item ${activeTab === tab.id ? 'active' : ''}`}
        onClick={() => onTabChange(tab.id)}
      >
        <span className="apple-nav-icon">{tab.icon}</span>
        <span className="apple-nav-label">{tab.title}</span>
      </button>
    ))}
  </div>
</nav>
```

### Características
- **Background**: Blanco translúcido con blur
- **Items**: Iconos + texto, padding generoso
- **Estado activo**: Azul Apple con texto blanco
- **Hover**: Fondo gris sutil
- **Responsive**: Stack vertical en mobile

---

## 🏠 Dashboard Apple

### Layout Propuesto
```jsx
<div className="apple-dashboard">
  <header className="apple-dashboard-header">
    <h1 className="apple-title-large">Dashboard</h1>
    <p className="apple-text-secondary">Gestión de combustibles</p>
  </header>
  
  <section className="apple-stats-grid">
    {/* Cards de estadísticas */}
  </section>
  
  <section className="apple-content-grid">
    {/* Tablas y contenido principal */}
  </section>
</div>
```

### Características
- **Header**: Título grande, subtítulo gris
- **Grid**: 4 columnas en desktop, responsive
- **Cards**: Blancas con sombra sutil
- **Espaciado**: Generoso, siguiendo 8pt grid

---

## 🎯 Plan de Implementación

### Fase 1: Tokens Base
1. Crear `apple-design-system.css` con todas las variables
2. Importar en `index.css`
3. Actualizar `designTokens.js` con tokens Apple

### Fase 2: Componentes Base
1. Crear `apple-components.css`
2. Definir clases para cards, botones, inputs
3. Estados hover, focus, active

### Fase 3: Navegación
1. Rediseñar `MainNavigation.jsx`
2. Aplicar estilos Apple
3. Implementar estados y transiciones

### Fase 4: Dashboard
1. Rediseñar `DashboardLayout.jsx`
2. Aplicar grid Apple
3. Rediseñar cards de estadísticas

### Fase 5: Componentes Específicos
1. Rediseñar tablas
2. Modales estilo Apple
3. Formularios y inputs

---

## 🔧 Modificaciones Necesarias

### Archivos a Modificar
1. `src/index.css` - Importar sistema Apple
2. `src/App.css` - Actualizar estilos base
3. `src/components/Dashboard/MainNavigation.jsx` - Rediseño completo
4. `src/components/Dashboard/DashboardLayout.jsx` - Layout Apple
5. `src/components/Dashboard/DashboardMain-SAP.jsx` - Aplicar estilos Apple
6. `src/components/shared/PageLayout.jsx` - Layout base Apple

### Nuevos Archivos
1. `src/styles/apple-design-system.css`
2. `src/styles/apple-components.css`
3. `src/styles/apple-layout.css`
4. `src/styles/apple-animations.css`

---

## 📐 Responsive Design Apple

### Breakpoints
- **Mobile**: < 768px - Navegación bottom, cards full-width
- **Tablet**: 768px - 1024px - Navegación top, grid 2-3 cols
- **Desktop**: > 1024px - Navegación lateral, grid 4 cols

### Adaptaciones
- **Typography**: Escala responsive
- **Spacing**: Reducido en mobile
- **Navigation**: Bottom tabs en mobile, top/side en desktop
- **Cards**: Full-width mobile, grid desktop

---

## ✅ Criterios de Éxito

### Visual
- [ ] Paleta de colores Apple implementada
- [ ] Tipografía SF Pro/Inter aplicada
- [ ] Espaciado 8pt grid consistente
- [ ] Sombras sutiles Apple
- [ ] Border radius Apple

### Funcional
- [ ] Navegación fluida y responsive
- [ ] Transiciones suaves
- [ ] Estados hover/focus claros
- [ ] Accesibilidad mantenida
- [ ] Performance optimizada

### UX
- [ ] Interfaz limpia y minimalista
- [ ] Jerarquía visual clara
- [ ] Interacciones intuitivas
- [ ] Consistencia en toda la app
- [ ] Responsive en todos los dispositivos

---

Este plan técnico detallado servirá como guía para la implementación completa del sistema de diseño Apple en la aplicación de combustibles.