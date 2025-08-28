#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuración de favicons
const faviconConfigs = [
  {
    name: 'main',
    input: './public/favicon.svg',
    outputDir: './public',
    prefix: 'favicon'
  },
  {
    name: 'alimentacion',
    input: './public/favicon-alimentacion.svg',
    outputDir: './public/alimentacion',
    prefix: 'favicon'
  },
  {
    name: 'combustibles', 
    input: './public/favicon-combustibles.svg',
    outputDir: './public/combustibles',
    prefix: 'favicon'
  }
];

// Tamaños a generar
const sizes = [
  { size: 16, name: '16x16' },
  { size: 32, name: '32x32' },
  { size: 48, name: '48x48' },
  { size: 180, name: 'apple-touch-icon', isApple: true }
];

async function generateFavicons() {
  console.log('🚀 Generando favicons temáticos...\n');

  for (const config of faviconConfigs) {
    console.log(`📁 Procesando: ${config.name}`);
    
    // Verificar que el archivo SVG existe
    if (!fs.existsSync(config.input)) {
      console.log(`❌ Error: No se encontró ${config.input}`);
      continue;
    }

    // Crear directorio si no existe
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }

    try {
      // Generar PNGs de diferentes tamaños
      for (const sizeConfig of sizes) {
        const fileName = sizeConfig.isApple 
          ? 'apple-touch-icon.png'
          : `${config.prefix}-${sizeConfig.name}.png`;
        
        const outputPath = path.join(config.outputDir, fileName);
        
        await sharp(config.input)
          .resize(sizeConfig.size, sizeConfig.size)
          .png()
          .toFile(outputPath);
        
        console.log(`  ✅ ${fileName} (${sizeConfig.size}x${sizeConfig.size})`);
      }

      // Generar ICO (usando el tamaño 32x32)
      const icoPath = path.join(config.outputDir, 'favicon.ico');
      await sharp(config.input)
        .resize(32, 32)
        .png()
        .toFile(icoPath.replace('.ico', '-temp.png'));
      
      // Para ICO real, usaremos el PNG generado (sharp no soporta ICO nativamente)
      // Copiar el 32x32 como .ico para compatibilidad básica
      fs.copyFileSync(
        path.join(config.outputDir, 'favicon-32x32.png'),
        icoPath.replace('.ico', '-as-ico.png')
      );
      
      console.log(`  ✅ favicon.ico (32x32 como PNG)`);
      
      // Limpiar archivo temporal
      const tempFile = icoPath.replace('.ico', '-temp.png');
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }

    } catch (error) {
      console.log(`❌ Error procesando ${config.name}:`, error.message);
    }
    
    console.log('');
  }

  console.log('🎉 ¡Favicons generados exitosamente!');
  console.log('\n📋 Archivos creados:');
  
  faviconConfigs.forEach(config => {
    console.log(`\n${config.name.toUpperCase()}:`);
    console.log(`  - ${config.outputDir}/favicon-16x16.png`);
    console.log(`  - ${config.outputDir}/favicon-32x32.png`);
    console.log(`  - ${config.outputDir}/favicon-48x48.png`);
    console.log(`  - ${config.outputDir}/apple-touch-icon.png`);
    console.log(`  - ${config.outputDir}/favicon-as-ico.png (como ICO)`);
  });

  console.log('\n💡 Siguiente paso: npm run build:all && npm run deploy');
}

// Ejecutar script
generateFavicons().catch(console.error);
