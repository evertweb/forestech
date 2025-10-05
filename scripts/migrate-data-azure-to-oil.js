#!/usr/bin/env node

console.warn("⚠️ 'scripts/migrate-data-azure-to-oil.js' está obsoleto. Usa 'scripts/migrate-data-to-digitalocean.js'.");

import('./migrate-data-to-digitalocean.js').catch((error) => {
	console.error('❌ No se pudo cargar el script actualizado:', error);
	process.exit(1);
});