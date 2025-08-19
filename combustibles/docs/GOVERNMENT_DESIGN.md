# 🏛️ Diseño Gubernamental - Formulario de Movimientos

## 📋 Descripción General

El nuevo prototipo de interfaz gubernamental transforma el formulario de movimientos en un documento oficial que emula el estilo de las instituciones gubernamentales colombianas.

## ✨ Beneficios del Nuevo Diseño

### ✅ **Profesional y Formal**

- **Tipografía oficial**: Times New Roman para encabezados, Arial para formularios
- **Colores institucionales**: Azul naval (#003366), dorado (#FFD700) como acentos
- **Estructura jerárquica**: Encabezados, códigos de referencia, timestamps
- **Logo corporativo**: Círculo dorado con iniciales "FC"

### ✅ **Información Estructurada**

- **Códigos únicos**: `FORESTECH-MOV-20250818-1234`
- **Referencias por paso**: `PASO-01`, `PASO-02`, etc.
- **Timestamps oficiales**: Formato DD/MM/AAAA HH:MM:SS
- **Clasificación de documentos**: "OFICIAL" en esquina superior

### ✅ **Responsive y Mobile-First**

- **Adaptación móvil**: Grid responsivo, botones full-width
- **Accesibilidad**: Alto contraste, focus states visibles
- **Touch-friendly**: Botones de mínimo 44px, espaciado adecuado
- **Navegación intuitiva**: Progreso visual, pasos numerados

### ✅ **Preparado para Impresión**

- **Estilos print**: Sin sombras, colores sólidos
- **Formato oficial**: Encabezado institucional, firmas al final
- **Tablas estructuradas**: Datos organizados en formato tabular
- **Códigos QR**: Espacio reservado para códigos de verificación

## 🎨 Elementos Visuales Clave

### 🔵 **Encabezado Institucional**

```jsx
<div className="government-header">
  <div className="government-reference">FORESTECH-MOV-20250818-1234</div>
  <div className="government-logo">FC</div>
  <h1 className="government-title">Forestech de Colombia S.A.S.</h1>
  <h2 className="government-subtitle">Sistema Integrado de Gestión de Combustibles</h2>
</div>
```

### 📊 **Indicador de Progreso Oficial**

```jsx
<div className="government-progress">
  <div className="progress-bar-government">
    <div className="progress-fill-government" style={{ width: '25%' }}></div>
  </div>
  <div className="progress-info">
    <span className="progress-step">Paso 2 de 8</span>
    <span className="progress-timestamp">18/08/2025 14:30:15</span>
  </div>
</div>
```

### 📝 **Campos de Formulario Oficiales**

```jsx
<div className="government-field">
  <div className="field-code">MOV-TYPE</div>
  <label className="government-label">
    Tipo de Movimiento <span className="required">*</span>
  </label>
  <select className="government-select">
    <option>ENTRADA - Recepción de Combustible</option>
    <option>SALIDA - Consumo de Combustible</option>
  </select>
  <div className="field-help">Seleccione según código de procedimientos interno</div>
</div>
```

### 📋 **Tabla de Datos del Sistema**

```jsx
<table className="government-data-table">
  <thead>
    <tr>
      <th>Campo</th>
      <th>Valor Actual</th>
      <th>Estado</th>
      <th>Código</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Inventario Disponible</td>
      <td>1,250.5 galones</td>
      <td>✅ Suficiente</td>
      <td>INV-001</td>
    </tr>
  </tbody>
</table>
```

## 🎯 Comparación con Diseño Actual

| Aspecto        | Diseño Actual              | Diseño Gubernamental    |
| -------------- | -------------------------- | ----------------------- |
| **Estilo**     | Moderno, glassmorphism     | Formal, institucional   |
| **Tipografía** | Sans-serif moderna         | Times New Roman oficial |
| **Colores**    | Gradientes, transparencias | Sólidos, alto contraste |
| **Navegación** | Wizard fluido              | Pasos documentados      |
| **Códigos**    | IDs internos               | Referencias oficiales   |
| **Impresión**  | No optimizado              | Formato oficial         |

## 🚀 Implementación

### 1. **Archivos Creados**

- `WizardSteps-Government.css` - Estilos gubernamentales completos
- `MovementWizardGovernment.jsx` - Componente prototipo funcional
- `GOVERNMENT_DESIGN.md` - Esta documentación

### 2. **Integración Sugerida**

```jsx
// Importar el nuevo estilo
import './WizardSteps-Government.css';

// Agregar prop para alternar estilos
const MovementWizard = ({ isOpen, onClose, theme = 'modern' }) => {
  const cssClass = theme === 'government' ? 'movement-wizard-government' : 'movement-wizard';

  return <div className={cssClass}>{/* Contenido adaptado según el theme */}</div>;
};
```

### 3. **Configuración de Usuario**

```jsx
// En settings o perfil de usuario
const [preferredTheme, setPreferredTheme] = useState('modern');

// Opciones: 'modern', 'government', 'corporate'
```

## 📱 Responsive Design

### **Móvil (< 768px)**

- Grid de una columna
- Botones full-width
- Encabezado compacto
- Tipografía escalada

### **Tablet (768px - 1024px)**

- Grid de dos columnas
- Navegación horizontal
- Espaciado medium

### **Desktop (> 1024px)**

- Grid completo
- Sidebar opcional
- Máximo aprovechamiento

## 🎨 Variables CSS Customizables

```css
:root {
  --gov-primary-blue: #003366; /* Azul institucional */
  --gov-accent-gold: #ffd700; /* Dorado oficial */
  --gov-font-family: 'Times New Roman', serif;
  --gov-spacing-md: 1rem; /* Espaciado estándar */
}
```

## 🔄 Siguientes Pasos

1. **Testing**: Probar prototipo con usuarios reales
2. **Feedback**: Recopilar opiniones sobre usabilidad
3. **Refinamiento**: Ajustar colores, espaciado, tipografía
4. **Integración**: Implementar como opción en configuración
5. **Documentación**: Crear guía de estilo completa

## 💡 Casos de Uso Ideales

- **Auditorías oficiales**: Presentación formal ante entidades
- **Reportes ejecutivos**: Documentos para directivos
- **Cumplimiento normativo**: Formularios con trazabilidad
- **Impresión física**: Documentos para archivo físico
- **Presentaciones institucionales**: Demos ante clientes corporativos

---

**Creado**: 18 de agosto de 2025  
**Versión**: 1.0.0  
**Autor**: GitHub Copilot + Forestech Team
