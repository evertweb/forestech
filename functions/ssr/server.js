import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHtmlTemplate } from './html-template.js';
import AppSSRMinimal from './AppSSRMinimal.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readCSRIndex = async () => {
  // Lee el index.html del build de combustibles publicado en hosting local (fallback)
  const root = path.resolve(__dirname, '../../');
  // En tiempo de emulador/hosting, serviremos desde /public/combustibles/index.html
  const filePath = path.resolve(root, '../public/combustibles/index.html');
  return fs.readFile(filePath, 'utf8');
};

export function healthHandler(req, res) {
  res.setHeader('Server-Timing', 'ssr_total;dur=1');
  res.status(200).send('OK');
}

export async function ssrHandler(req, res) {
  const start = Date.now();
  
  const sendFallback = async (status = 200) => {
    try {
      const html = await readCSRIndex();
      res.setHeader('x-fallback-csr', '1');
      res.status(status).send(html);
    } catch (e) {
      console.error('Fallback error:', e);
      res.status(500).send('SSR fallback error');
    }
  };

  try {
    // Preparar initial state (vacío por ahora, se llenará en Fase 2)
    const initialState = {
      route: req.path,
      timestamp: Date.now(),
      ssr: true
    };

    // Determinar metadatos por ruta
    let title = 'Combustibles - Gestión de Inventario';
    let description = 'Sistema de gestión de inventario de combustibles';
    
    if (req.path.includes('/login') || req.path === '/combustibles/' || req.path === '/combustibles') {
      title = 'Login - Combustibles';
      description = 'Acceder al sistema de gestión de combustibles';
    } else if (req.path.includes('/movimientos')) {
      title = 'Movimientos - Combustibles';
      description = 'Gestión de movimientos de combustible';
    }

    const { pipe } = renderToPipeableStream(
      React.createElement(AppSSRMinimal, { 
        location: req.url
      }),
      {
        onShellReady() {
          res.status(200);
          res.setHeader('Content-Type', 'text/html');
          const dur = Date.now() - start;
          res.setHeader('Server-Timing', `ssr_total;dur=${dur}, ssr_render;dur=${dur}`);
          
          // Crear HTML template completo
          const html = createHtmlTemplate({
            title,
            description,
            initialState,
            appHtml: '', // Se llenará por pipe
            serverTiming: `ssr_total;dur=${dur}`
          });
          
          // Enviar template hasta el div root
          const [beforeRoot, afterRoot] = html.split('<div id="root">');
          const [, afterContent] = afterRoot.split('</div>');
          
          res.write(beforeRoot + '<div id="root">');
          pipe(res);
          res.write('</div>' + afterContent);
        },
        onError(err) {
          console.error('SSR render error:', err);
          sendFallback();
        },
      }
    );
  } catch (e) {
    console.error('SSR top-level error', e);
    sendFallback();
  }
}
