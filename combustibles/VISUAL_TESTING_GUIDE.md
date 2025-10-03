# 🧪 Guía de Pruebas Visuales - Formulario Minimalista de Proveedores

## 📋 Checklist de Pruebas Visuales

### ✅ **1. Layout General**
- [ ] Modal se abre centrado en pantalla
- [ ] Ancho máximo apropiado (max-w-4xl)
- [ ] Scroll vertical funciona suavemente
- [ ] Scrollbar minimalista visible (6px, gris)
- [ ] Todas las secciones visibles sin tabs

### ✅ **2. Secciones**
Verificar que aparezcan en este orden:
- [ ] **INFORMACIÓN BÁSICA** (título gris uppercase)
- [ ] **CONTACTO** (título gris uppercase)
- [ ] **PRODUCTOS SUMINISTRADOS** (título gris uppercase)
- [ ] **INFORMACIÓN COMERCIAL** (título gris uppercase)

### ✅ **3. Campos de Entrada**

#### Inputs Normales
- [ ] Borde gris (#d2d2d7) de 1px
- [ ] Fondo blanco (sin color)
- [ ] Border radius 8px
- [ ] Altura 44px (touch-friendly)
- [ ] Placeholder gris (#86868b)
- [ ] Focus: Borde azul (#007aff)
- [ ] Error: Borde rojo (#ff3b30) + mensaje

#### Select
- [ ] Flecha dropdown visible
- [ ] Mismo estilo que inputs
- [ ] Cursor pointer al hover

#### Textarea
- [ ] Min-height 80px
- [ ] Resize vertical permitido
- [ ] Mismo estilo que inputs

### ✅ **4. Productos (Crítico)**
Verificar cada línea de combustible:
- [ ] Checkbox a la izquierda
- [ ] Nombre del combustible legible
- [ ] Input de precio a la derecha
- [ ] Input disabled (gris) cuando checkbox no está marcado
- [ ] Input enabled (blanco) cuando checkbox está marcado
- [ ] "$" visible antes del input

Ejemplo visual esperado:
```
☑ ACPM                    $ [10,500.00]   ← Enabled
☑ Gasolina Corriente      $ [12,300.00]   ← Enabled
☐ Diesel                  $ [──────────]  ← Disabled (gris)
```

### ✅ **5. Rating**
- [ ] Select simple (no slider)
- [ ] Opciones con estrellas:
  - ★★★★★ Excelente
  - ★★★★☆ Muy bueno
  - ★★★☆☆ Bueno
  - ★★☆☆☆ Regular
  - ★☆☆☆☆ Malo

### ✅ **6. Responsive (Mobile)**
Probar en ventana < 768px:
- [ ] Grid cambia a 1 columna
- [ ] Campos ocupan ancho completo
- [ ] Productos en stack vertical
- [ ] Inputs mantienen altura 44px
- [ ] Texto legible (15px mínimo)

### ✅ **7. Estados Interactivos**

#### Hover
- [ ] Inputs: Borde cambia a gris más oscuro (#b8b8bd)
- [ ] Checkboxes: Borde cambia a azul

#### Focus
- [ ] Borde azul #007aff
- [ ] Sin glow excesivo
- [ ] Outline visible (accesibilidad)

#### Disabled
- [ ] Fondo gris claro (#f5f5f7)
- [ ] Texto gris (#86868b)
- [ ] Opacidad 0.6
- [ ] Cursor not-allowed

#### Error
- [ ] Borde rojo (#ff3b30)
- [ ] Mensaje de error debajo (12px, rojo)
- [ ] Sin fondo de color

### ✅ **8. Espaciado**
- [ ] Entre secciones: 32px
- [ ] Entre campos: 20px
- [ ] Padding interno inputs: 12px
- [ ] Línea divisoria entre secciones: 1px gris

### ✅ **9. Tipografía**
- [ ] Títulos sección: 13px, gris, uppercase
- [ ] Labels: 14px, negro
- [ ] Inputs: 15px
- [ ] Placeholder: 15px, gris
- [ ] Errores: 12px, rojo
- [ ] Font: SF Pro Text o system-ui

### ✅ **10. Botones Footer**
- [ ] Cancelar: Ghost button (sin relleno)
- [ ] Guardar: Primary button (azul)
- [ ] Alineados a la derecha
- [ ] Gap de 12px entre ellos

### ✅ **11. Accesibilidad**
- [ ] Tab navigation funciona
- [ ] Focus visible en todos los elementos
- [ ] Labels asociados a inputs
- [ ] Mensajes de error leíbles por screen readers
- [ ] Contraste cumple WCAG AA

---

## 🎯 Casos de Prueba Específicos

### **Caso 1: Crear Nuevo Proveedor**
1. Click en "Nuevo Proveedor"
2. Verificar:
   - [ ] Modal abre con título "Nuevo Proveedor 🚚"
   - [ ] Todos los campos vacíos
   - [ ] Ningún combustible seleccionado
   - [ ] Todos los inputs de precio disabled
   - [ ] Rating default: ★★★★★ Excelente

### **Caso 2: Editar Proveedor Existente**
1. Click en editar un proveedor con datos
2. Verificar:
   - [ ] Modal abre con título "Editar Proveedor 🚚"
   - [ ] Campos pre-llenados con datos
   - [ ] Combustibles correctamente marcados
   - [ ] Precios visibles en combustibles marcados
   - [ ] Rating muestra valor correcto

### **Caso 3: Validación de Errores**
1. Llenar formulario con datos inválidos:
   - Dejar nombre vacío
   - Email inválido
   - Teléfono mal formato
2. Click en "Guardar"
3. Verificar:
   - [ ] Bordes rojos en campos con error
   - [ ] Mensajes de error visibles
   - [ ] Modal NO se cierra
   - [ ] Focus va al primer campo con error

### **Caso 4: Productos - Interacción**
1. Marcar checkbox "ACPM"
2. Verificar:
   - [ ] Input de precio se habilita (fondo blanco)
   - [ ] Cursor cambia en input
   - [ ] Puede escribir precio
3. Desmarcar checkbox
4. Verificar:
   - [ ] Input se deshabilita (fondo gris)
   - [ ] Precio se limpia
   - [ ] Cursor not-allowed

### **Caso 5: Scroll Largo**
1. Abrir modal
2. Scroll down
3. Verificar:
   - [ ] Scroll smooth
   - [ ] Header fijo (título y X)
   - [ ] Footer fijo (botones)
   - [ ] Scrollbar visible
   - [ ] Contenido no se corta

---

## 🐛 Errores Comunes a Buscar

### **Layout**
- ❌ Inputs demasiado pequeños en móvil
- ❌ Texto cortado en labels
- ❌ Secciones sin separación visual
- ❌ Modal muy ancho en pantallas grandes

### **Interacción**
- ❌ Inputs de precio NO se deshabilitan al desmarcar
- ❌ Focus no visible
- ❌ Hover sin feedback
- ❌ Click en overlay no cierra modal

### **Visual**
- ❌ Fondos de color en inputs (debe ser blanco)
- ❌ Sombras excesivas
- ❌ Colores que distraen
- ❌ Tipografía inconsistente

### **Responsive**
- ❌ Grid no cambia a 1 columna en móvil
- ❌ Inputs muy pequeños para touch
- ❌ Texto ilegible en móvil
- ❌ Modal muy ancho en tablet

---

## 📸 Capturas de Pantalla Sugeridas

1. **Desktop - Vista completa**: Modal abierto, scroll arriba
2. **Desktop - Sección Productos**: Mostrando checkboxes + precios
3. **Desktop - Focus state**: Input con focus azul
4. **Desktop - Error state**: Input con error rojo
5. **Mobile - Vista completa**: Modal en móvil, layout 1 columna
6. **Mobile - Productos**: Stack vertical en móvil
7. **Tablet - Vista general**: Layout intermedio

---

## ✅ Criterios de Aprobación

El diseño está **APROBADO** si:
- ✅ Todos los checkboxes visuales están marcados
- ✅ Todos los casos de prueba pasan
- ✅ No hay errores comunes detectados
- ✅ Responsive funciona en móvil y tablet
- ✅ Accesibilidad básica cumplida

---

**Última actualización**: Enero 2025  
**Responsable de pruebas**: QA Team / Product Owner  
**Estado**: Pendiente de pruebas
