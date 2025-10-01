const { execSync, spawn } = require('child_process');

try {
  // Instalar Puppeteer temporalmente
  console.log('Instalando Puppeteer...');
  execSync('npm install puppeteer --save-dev', { stdio: 'inherit' });

  // Ejecutar la app en background
  console.log('Iniciando la app combustibles en background...');
  const devProcess = spawn('npm', ['run', 'dev:combustibles'], {
    detached: true,
    stdio: 'ignore'
  });

  // Esperar 10 segundos para que la app cargue
  console.log('Esperando que la app cargue...');
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Lanzar Puppeteer
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push(`${msg.type().toUpperCase()}: ${msg.text()}`);
    }
  });

  console.log('Navegando a http://localhost:5174...');
  await page.goto('http://localhost:5174');

  // Esperar 5 segundos adicionales para capturar errores
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Imprimir errores
  if (errors.length > 0) {
    console.log('Errores de consola capturados:');
    console.log(errors.join('\n'));
  } else {
    console.log('No se encontraron errores en la consola');
  }

  // Cerrar navegador
  await browser.close();

  // Detener el proceso de dev
  devProcess.kill();
  console.log('Proceso completado.');

} catch (error) {
  console.error('Error específico:', error.message);
}