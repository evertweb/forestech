/**
 * Script para auditoría completa de botones en la aplicación Forestech
 * Busca todos los botones y verifica su estado funcional
 */

const fs = require('fs');
const path = require('path');

function findButtons(dir, filePattern = /\.(jsx|js|ts|tsx)$/) {
  const results = [];
  
  function scanDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (stat.isFile() && filePattern.test(file)) {
        analyzeFile(fullPath);
      }
    }
  }
  
  function analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Buscar botones
        const buttonMatches = [
          /<button[^>]*>/gi,
          /onClick\s*=\s*{[^}]*}/gi,
          /className\s*=\s*['""][^'"]*btn[^'"]*['"']/gi
        ];
        
        buttonMatches.forEach(pattern => {
          const matches = line.match(pattern);
          if (matches) {
            matches.forEach(match => {
              results.push({
                file: filePath,
                line: index + 1,
                content: line.trim(),
                match: match,
                type: getButtonType(line)
              });
            });
          }
        });
      });
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error.message);
    }
  }
  
  function getButtonType(line) {
    if (line.includes('disabled')) return 'disabled';
    if (line.includes('onClick')) return 'clickable';
    if (line.includes('btn-primary')) return 'primary';
    if (line.includes('btn-secondary')) return 'secondary';
    if (line.includes('btn-danger')) return 'danger';
    return 'button';
  }
  
  scanDirectory(dir);
  return results;
}

// Buscar en el directorio de combustibles
const combustiblesDir = '/home/hp/Documents/forestech/combustibles/src';
const buttons = findButtons(combustiblesDir);

// Generar reporte
console.log('🔍 AUDITORÍA COMPLETA DE BOTONES - FORESTECH');
console.log('='.repeat(50));

const buttonsByFile = {};
buttons.forEach(button => {
  const relativePath = button.file.replace('/home/hp/Documents/forestech/combustibles/src/', '');
  if (!buttonsByFile[relativePath]) {
    buttonsByFile[relativePath] = [];
  }
  buttonsByFile[relativePath].push(button);
});

Object.keys(buttonsByFile).sort().forEach(file => {
  console.log(`\n📁 ${file}`);
  console.log('-'.repeat(30));
  
  buttonsByFile[file].forEach((button, index) => {
    console.log(`  ${index + 1}. Línea ${button.line}: ${button.type.toUpperCase()}`);
    console.log(`     ${button.content.substring(0, 80)}${button.content.length > 80 ? '...' : ''}`);
  });
});

console.log(`\n📊 RESUMEN:`);
console.log(`Total de botones encontrados: ${buttons.length}`);
console.log(`Archivos con botones: ${Object.keys(buttonsByFile).length}`);

// Estadísticas por tipo
const typeStats = {};
buttons.forEach(button => {
  typeStats[button.type] = (typeStats[button.type] || 0) + 1;
});

console.log('\n📈 Por tipo:');
Object.entries(typeStats).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}`);
});
