#!/usr/bin/env node

const toIco = require('to-ico');
const fs = require('fs');
const path = require('path');

const directories = [
  './public',
  './public/alimentacion', 
  './public/combustibles'
];

async function generateIcoFiles() {
  console.log('🔧 Generando archivos ICO reales...\n');

  for (const dir of directories) {
    const png16Path = path.join(dir, 'favicon-16x16.png');
    const png32Path = path.join(dir, 'favicon-32x32.png');
    const icoPath = path.join(dir, 'favicon.ico');

    if (fs.existsSync(png16Path) && fs.existsSync(png32Path)) {
      try {
        const png16 = fs.readFileSync(png16Path);
        const png32 = fs.readFileSync(png32Path);
        
        const ico = await toIco([png16, png32]);
        fs.writeFileSync(icoPath, ico);
        
        console.log(`✅ Generado: ${icoPath}`);
        
        // Limpiar archivo temporal si existe
        const tempIcoPath = path.join(dir, 'favicon-as-ico.png');
        if (fs.existsSync(tempIcoPath)) {
          fs.unlinkSync(tempIcoPath);
        }
        
      } catch (error) {
        console.log(`❌ Error generando ICO para ${dir}:`, error.message);
      }
    } else {
      console.log(`⚠️  PNG files not found in ${dir}`);
    }
  }

  console.log('\n🎉 Archivos ICO generados exitosamente!');
}

generateIcoFiles().catch(console.error);
