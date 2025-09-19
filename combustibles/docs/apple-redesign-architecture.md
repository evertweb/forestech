# Arquitectura del Rediseño Apple - Combustibles App

## 🏗️ Diagrama de Arquitectura

```mermaid
graph TB
    subgraph "Apple Design System"
        A[apple-design-system.css] --> B[Design Tokens]
        A --> C[Color Palette]
        A --> D[Typography SF Pro]
        A --> E[Spacing 8pt Grid]
        
        F[apple-components.css] --> G[Cards Apple]
        F --> H[Buttons Apple]
        F --> I[Inputs Apple]
        F --> J[Navigation Apple]
        
        K[apple-layout.css] --> L[Grid System]
        K --> M[Containers]
        K --> N[Responsive]
        
        O[apple-animations.css] --> P[Transitions]
        O --> Q[Micro-interactions]
        O --> R[Hover States]
    end
    
    subgraph "Componentes Rediseñados"
        S[MainNavigation] --> T[iOS/macOS Style]
        U[DashboardLayout] --> V[Apple Grid]
        W[DashboardMain] --> X[Minimalist Cards]
        Y[PageLayout] --> Z[Clean Structure]
    end
    
    subgraph "Secciones Prioritarias"
        AA[Dashboard] --> BB[Stats Cards]
        AA --> CC[Activity Table]
        DD[Inventario] --> EE[Product Cards]
        DD --> FF[Stock Table]
        GG[Movimientos] --> HH[Movement Cards]
        GG --> II[History Table]
    end
    
    A --> S
    F --> U
    K --> W
    O --> Y
```

## 🎨 Flujo de Implementación

```mermaid
flowchart LR
    A[Tokens Base] --> B[Componentes]
    B --> C[Navegación]
    C --> D[Dashboard]
    D --> E[Inventario]
    E --> F[Movimientos]
    F --> G[Optimización]
    G --> H[Testing]
```

## 📱 Responsive Strategy

```mermaid
graph TD
    A[Mobile < 768px] --> B[Bottom Navigation]
    A --> C[Single Column]
    A --> D[Full Width Cards]
    
    E[Tablet 768-1024px] --> F[Top Navigation]
    E --> G[2-3 Column Grid]
    E --> H[Medium Cards]
    
    I[Desktop > 1024px] --> J[Side Navigation]
    I --> K[4 Column Grid]
    I --> L[Compact Cards]
```

## 🔄 Comparación: Antes vs Después

### Antes (SAP Fiori)
- **Colores**: Teal, Verdigris, Nyanza (coloridos)
- **Tipografía**: Open Sans, 72 SAP
- **Navegación**: Tabs horizontales con iconos
- **Cards**: Bordes definidos, colores corporativos
- **Espaciado**: Variable, no sistemático

### Después (Apple Style)
- **Colores**: Grises neutros, azul sistema
- **Tipografía**: SF Pro (Inter fallback)
- **Navegación**: iOS/macOS style, minimalista
- **Cards**: Sombras sutiles, bordes redondeados
- **Espaciado**: 8pt grid sistemático

## 🎯 Componentes Clave a Rediseñar

### 1. MainNavigation
```
Actual: Tabs horizontales con iconos y subtítulos
Apple:  Navegación limpia, estados sutiles, blur background
```

### 2. Dashboard Cards
```
Actual: Cards coloridas con gradientes
Apple:  Cards blancas, sombras sutiles, tipografía clara
```

### 3. Tables
```
Actual: Bordes definidos, colores SAP
Apple:  Líneas sutiles, espaciado generoso, hover suave
```

### 4. Buttons
```
Actual: Gradientes, múltiples variantes
Apple:  Sólidos, estados claros, border-radius consistente
```

## 📊 Métricas de Éxito

### Performance
- [ ] Tiempo de carga < 2s
- [ ] Smooth animations 60fps
- [ ] Responsive en todos los breakpoints

### UX
- [ ] Navegación intuitiva
- [ ] Jerarquía visual clara
- [ ] Accesibilidad WCAG 2.1 AA

### Visual
- [ ] Consistencia Apple
- [ ] Paleta neutra aplicada
- [ ] Tipografía SF Pro implementada

## 🚀 Plan de Rollout

### Fase 1: Fundación (Semana 1)
- [x] Documentación sistema Apple
- [-] Design tokens implementados
- [ ] Componentes base creados

### Fase 2: Navegación (Semana 1-2)
- [ ] MainNavigation rediseñada
- [ ] DashboardLayout actualizado
- [ ] Estados y transiciones

### Fase 3: Dashboard (Semana 2)
- [ ] Cards rediseñadas
- [ ] Tablas actualizadas
- [ ] Responsive implementado

### Fase 4: Secciones (Semana 2-3)
- [ ] Inventario rediseñado
- [ ] Movimientos rediseñado
- [ ] Componentes compartidos

### Fase 5: Optimización (Semana 3)
- [ ] Performance tuning
- [ ] Testing cross-browser
- [ ] Ajustes finales

## 🔧 Herramientas y Tecnologías

### Existentes (Mantener)
- React 19.1.0
- Vite
- CSS Variables
- Tailwind CSS

### Nuevas (Agregar)
- Inter font (SF Pro fallback)
- Apple design tokens
- Nuevos componentes CSS

### Modificar
- Sistema de colores actual
- Componentes de navegación
- Layout del dashboard
- Estilos de cards y tablas

---

## 📋 Checklist de Implementación

### Design Tokens ✅
- [x] Documentación completa
- [ ] Variables CSS creadas
- [ ] Importación configurada
- [ ] Tokens aplicados

### Componentes Base
- [ ] Cards Apple style
- [ ] Buttons Apple style
- [ ] Inputs Apple style
- [ ] Navigation Apple style

### Layout
- [ ] Grid system Apple
- [ ] Containers responsive
- [ ] Spacing sistemático

### Navegación
- [ ] MainNavigation rediseñada
- [ ] Estados activos/hover
- [ ] Responsive behavior

### Dashboard
- [ ] Layout minimalista
- [ ] Cards rediseñadas
- [ ] Tablas actualizadas

### Secciones
- [ ] Inventario Apple style
- [ ] Movimientos Apple style
- [ ] Componentes compartidos

---

Esta arquitectura garantiza un rediseño sistemático y coherente, manteniendo la funcionalidad existente mientras se transforma completamente la experiencia visual hacia el estilo Apple.