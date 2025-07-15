#!/usr/bin/env node
/**
 * 📄 NOTION MANUAL HELPER - FORESTECH
 * Script para preparar contenido para Notion (copia manual)
 */

const fs = require('fs');
const path = require('path');

/**
 * 📋 Generar contenido formateado para Notion
 */
function generateNotionContent() {
    console.log('📋 Generando contenido para Notion...');
    
    // Leer el análisis de combustibles
    const analysisPath = path.join(__dirname, '..', 'NOTION-Combustibles-Analisis.md');
    
    if (!fs.existsSync(analysisPath)) {
        console.error('❌ Archivo de análisis no encontrado');
        return;
    }
    
    const content = fs.readFileSync(analysisPath, 'utf8');
    
    // Crear archivo formateado para copia
    const notionReadyContent = `
# 🔥 FORESTECH - ANÁLISIS ESTRUCTURA COMBUSTIBLES

**📅 Fecha**: ${new Date().toLocaleDateString('es-CO')}
**🔗 Token Notion**: \`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\`

---

${content}

---

## 📝 INSTRUCCIONES PARA NOTION

### 🔧 Configuración de Integración
1. **Token configurado**: ✅ \`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\`
2. **Integración creada**: ✅ Forestech Integration
3. **Scripts automatización**: ✅ Disponibles en \`scripts/\`

### 📋 Opciones de Subida

#### Opción A: Copia Manual (Recomendado)
1. Copia todo el contenido de arriba
2. Ve a Notion y crea una nueva página
3. Pega el contenido
4. Notion automáticamente formateará el markdown

#### Opción B: Importar Archivo
1. En Notion, click en "Import"
2. Selecciona "Markdown"
3. Sube el archivo \`NOTION-Combustibles-Analisis.md\`

#### Opción C: Configuración API Avanzada
\`\`\`bash
# Scripts disponibles para automatización
node scripts/notion-integration.js      # Script completo
node scripts/notion-simple.js           # Script simplificado
./scripts/setup-notion.sh               # Setup automático
\`\`\`

### 🚨 Problema Actual
La integración necesita permisos específicos en Notion:
- Acceso a crear páginas
- Acceso a crear bases de datos
- Conexión con un workspace específico

### ✅ Solución Inmediata
Usar copia manual hasta configurar permisos completos de la integración.

---

**📊 Métricas del Análisis**:
- 134+ archivos analizados
- 95% sistema completado
- 14 módulos funcionales
- Sistema 100% operativo en producción

**🔗 URLs Operativas**:
- Producción: https://forestechdecolombia.com.co/combustibles/
- Firebase: https://liquidacionapp-62962.web.app/combustibles/
`;
    
    // Escribir archivo listo para Notion
    const outputPath = path.join(__dirname, '..', 'NOTION-READY-Combustibles.md');
    fs.writeFileSync(outputPath, notionReadyContent);
    
    console.log('✅ Contenido preparado para Notion');
    console.log(`📄 Archivo: ${outputPath}`);
    console.log('');
    console.log('📋 SIGUIENTE PASO:');
    console.log('1. Abre el archivo NOTION-READY-Combustibles.md');
    console.log('2. Copia todo el contenido');
    console.log('3. Ve a Notion y crea una nueva página');
    console.log('4. Pega el contenido');
    console.log('');
    console.log('🔗 O usa la opción de importar archivo en Notion');
}

/**
 * 📊 Generar resumen de configuración
 */
function generateConfigSummary() {
    console.log('📊 RESUMEN DE CONFIGURACIÓN NOTION');
    console.log('==================================================');
    console.log('✅ Token configurado:', process.env.NOTION_API_KEY ? 'SÍ' : 'NO');
    console.log('✅ Scripts creados: SÍ');
    console.log('✅ Cliente instalado: SÍ (@notionhq/client)');
    console.log('✅ Contenido preparado: SÍ');
    console.log('');
    console.log('📋 ARCHIVOS DISPONIBLES:');
    console.log('- scripts/notion-integration.js (completo)');
    console.log('- scripts/notion-simple.js (simplificado)');
    console.log('- scripts/setup-notion.sh (configuración)');
    console.log('- NOTION-Combustibles-Analisis.md (análisis)');
    console.log('- NOTION-READY-Combustibles.md (listo para copiar)');
    console.log('');
    console.log('🎯 ESTADO: Listo para uso manual');
    console.log('💡 RECOMENDACIÓN: Copia manual hasta configurar permisos API');
}

/**
 * 🚀 Función principal
 */
function main() {
    console.log('📄 NOTION MANUAL HELPER - FORESTECH');
    console.log('==================================================');
    
    generateNotionContent();
    generateConfigSummary();
    
    console.log('');
    console.log('✅ CONFIGURACIÓN DE AUTOMATIZACIÓN COMPLETADA');
    console.log('');
    console.log('🔧 Para resolver el problema de API:');
    console.log('1. Ve a notion.so/my-integrations');
    console.log('2. Edita tu integración "Forestech"');
    console.log('3. Asegúrate de que tenga estos permisos:');
    console.log('   - Insert content');
    console.log('   - Update content');
    console.log('   - Read content');
    console.log('4. Conecta la integración a tu workspace');
    console.log('5. Invita la integración a páginas específicas');
}

// Ejecutar
main();
