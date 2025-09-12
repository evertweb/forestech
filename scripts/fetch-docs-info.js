#!/usr/bin/env node

/**
 * FORESTECH DOCS FETCHER & N8N UPDATER
 * Script para extraer información de documentación y gestionar n8n
 * Autor: Claude para Forestech
 * Fecha: 2025-01-12
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class DocsInfoExtractor {
  constructor(options = {}) {
    this.timeout = options.timeout || 15000; // Aumentar timeout
    this.maxRetries = options.maxRetries || 3;
    this.userAgent = options.userAgent || 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    this.outputDir = options.outputDir || './docs-extracted';
    this.verbose = options.verbose || true; // Activar verbose por defecto
  }

  /**
   * Realizar fetch a una URL y extraer información
   */
  async fetchDocumentation(url, options = {}) {
    this.log(`🌐 Fetching documentation from: ${url}`);

    try {
      const response = await this.makeRequest(url, options);
      this.log(`📄 Content length: ${response.data.length} characters`);

      const content = await this.processResponse(response);
      const extracted = await this.extractInformation(content, url);

      if (options.saveToFile) {
        await this.saveToFile(extracted, options.saveToFile);
      }

      return extracted;
    } catch (error) {
      this.log(`❌ Error fetching ${url}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Realizar petición HTTP/HTTPS con reintentos
   */
  async makeRequest(url, options = {}) {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': this.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
        ...options.headers
      },
      timeout: this.timeout
    };

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.log(`🔄 Attempt ${attempt}/${this.maxRetries} for ${urlObj.hostname}`);
        return await this.performRequest(client, requestOptions);
      } catch (error) {
        if (attempt === this.maxRetries) throw error;
        this.log(`⚠️  Attempt ${attempt} failed: ${error.message}, retrying...`);
        await this.sleep(2000 * attempt); // Backoff exponencial
      }
    }
  }

  /**
   * Realizar la petición HTTP
   */
  performRequest(client, options) {
    return new Promise((resolve, reject) => {
      const req = client.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        });
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  }

  /**
   * Procesar la respuesta HTTP
   */
  async processResponse(response) {
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new Error(`HTTP ${response.statusCode}: Request failed`);
    }

    return response.data;
  }

  /**
   * Extraer información específica del contenido
   */
  async extractInformation(content, url) {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    // Extracción base
    const extracted = {
      url: url,
      domain: domain,
      timestamp: new Date().toISOString(),
      content: {
        title: this.extractTitle(content),
        headings: this.extractHeadings(content),
        codeBlocks: this.extractCodeBlocks(content),
        links: this.extractLinks(content, url),
        images: this.extractImages(content, url)
      },
      metadata: {
        length: content.length,
        hasDockerInfo: content.toLowerCase().includes('docker'),
        hasInstallInfo: content.toLowerCase().includes('install'),
        hasUpdateInfo: content.toLowerCase().includes('update')
      }
    };

    // Extracción específica para n8n docs
    if (domain.includes('n8n.io')) {
      extracted.n8n = await this.extractN8NInfo(content);
    }

    return extracted;
  }

  /**
   * Extraer información específica de n8n con información manual
   */
  async extractN8NInfo(content) {
    const n8nInfo = {
      dockerCommands: this.extractDockerCommands(content),
      versions: this.extractVersions(content),
      updateSteps: this.extractUpdateSteps(content),
      backupInfo: this.extractBackupInfo(content),
      configuration: this.extractConfiguration(content),
      // Agregar información manual conocida para n8n
      knownCommands: this.getKnownN8NCommands(),
      updateProcess: this.getKnownUpdateProcess()
    };

    return n8nInfo;
  }

  /**
   * Comandos conocidos de n8n Docker
   */
  getKnownN8NCommands() {
    return {
      backup: [
        'docker exec n8n n8n export:workflow --all --output=/tmp/workflows-backup.json',
        'docker cp n8n:/tmp/workflows-backup.json ./workflows-backup.json',
        'docker exec n8n cp /home/node/.n8n/database.sqlite /tmp/database-backup.sqlite',
        'docker cp n8n:/tmp/database-backup.sqlite ./database-backup.sqlite'
      ],
      update: [
        'docker stop n8n',
        'docker pull n8nio/n8n:latest',
        'docker rm n8n',
        'docker run -d --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n:latest'
      ],
      status: [
        'docker ps --filter name=n8n',
        'docker exec n8n n8n --version',
        'docker logs n8n --tail 50'
      ]
    };
  }

  /**
   * Proceso de actualización conocido
   */
  getKnownUpdateProcess() {
    return [
      "1. Crear backup completo de workflows y base de datos",
      "2. Parar el contenedor actual de n8n",
      "3. Descargar la nueva imagen de Docker",
      "4. Eliminar el contenedor anterior (mantener volúmenes)",
      "5. Crear nuevo contenedor con la nueva imagen",
      "6. Verificar que n8n inicie correctamente",
      "7. Comprobar que los workflows estén disponibles"
    ];
  }

  /**
   * Extraer comandos Docker del contenido
   */
  extractDockerCommands(content) {
    const dockerRegex = /(?:```(?:bash|shell|sh)?\s*\n)?(docker\s+[^`\n]+)/gi;
    const commands = [];
    let match;

    while ((match = dockerRegex.exec(content)) !== null) {
      commands.push(match[1].trim());
    }

    return commands;
  }

  /**
   * Extraer información de versiones
   */
  extractVersions(content) {
    const versionRegex = /(?:version|v\.?)\s*:?\s*([0-9]+\.[0-9]+\.[0-9]+(?:\.[0-9]+)?)/gi;
    const versions = [];
    let match;

    while ((match = versionRegex.exec(content)) !== null) {
      versions.push(match[1]);
    }

    return [...new Set(versions)]; // Eliminar duplicados
  }

  /**
   * Extraer pasos de actualización
   */
  extractUpdateSteps(content) {
    const steps = [];

    // Buscar secciones de actualización
    const updateSections = content.match(/(?:updating?|upgrade?|migration?)[\s\S]*?(?=##|$)/gi) || [];

    updateSections.forEach(section => {
      const stepMatches = section.match(/\d+\.\s*([^\n]+)/g) || [];
      stepMatches.forEach(step => {
        steps.push(step.trim());
      });
    });

    return steps;
  }

  /**
   * Extraer información de backup
   */
  extractBackupInfo(content) {
    const backupRegex = /backup[\s\S]*?(?=##|$)/gi;
    const backupSections = content.match(backupRegex) || [];

    return backupSections.map(section => section.trim());
  }

  /**
   * Extraer configuración
   */
  extractConfiguration(content) {
    const configRegex = /(?:config|environment|env)[\s\S]*?(?=##|$)/gi;
    const configSections = content.match(configRegex) || [];

    return configSections.map(section => section.trim());
  }

  /**
   * Extraer título de la página
   */
  extractTitle(content) {
    const titleMatch = content.match(/<title>(.*?)<\/title>/i) ||
                      content.match(/^#\s+(.+)/m);
    return titleMatch ? titleMatch[1].trim() : 'Sin título';
  }

  /**
   * Extraer encabezados
   */
  extractHeadings(content) {
    const headingRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>|^(#{1,6})\s+(.+)$/gmi;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      if (match[1]) {
        // HTML heading
        headings.push(match[1].replace(/<[^>]+>/g, '').trim());
      } else if (match[3]) {
        // Markdown heading
        headings.push(match[3].trim());
      }
    }

    return headings;
  }

  /**
   * Extraer bloques de código
   */
  extractCodeBlocks(content) {
    const codeRegex = /```(\w+)?\s*\n([\s\S]*?)```|<code[^>]*>(.*?)<\/code>/g;
    const codeBlocks = [];
    let match;

    while ((match = codeRegex.exec(content)) !== null) {
      codeBlocks.push({
        language: match[1] || 'text',
        code: (match[2] || match[3] || '').trim()
      });
    }

    return codeBlocks;
  }

  /**
   * Extraer enlaces
   */
  extractLinks(content, baseUrl) {
    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>|\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [];
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const url = match[1] || match[4];
      const text = match[2] || match[3];

      if (url) {
        try {
          const fullUrl = new URL(url, baseUrl).href;
          links.push({ text: text?.trim() || '', url: fullUrl });
        } catch (e) {
          // URL inválida, ignorar
        }
      }
    }

    return links;
  }

  /**
   * Extraer imágenes
   */
  extractImages(content, baseUrl) {
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>|!\[([^\]]*)\]\(([^)]+)\)/g;
    const images = [];
    let match;

    while ((match = imgRegex.exec(content)) !== null) {
      const src = match[1] || match[3];
      const alt = match[2] || '';

      if (src) {
        try {
          const fullUrl = new URL(src, baseUrl).href;
          images.push({ alt: alt.trim(), src: fullUrl });
        } catch (e) {
          // URL inválida, ignorar
        }
      }
    }

    return images;
  }

  /**
   * Guardar datos extraídos a archivo
   */
  async saveToFile(data, filename) {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      const filePath = path.join(this.outputDir, filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      this.log(`💾 Data saved to: ${filePath}`);
    } catch (error) {
      this.log(`❌ Error saving file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Utilidad para logging
   */
  log(message) {
    if (this.verbose) {
      console.log(`[${new Date().toISOString()}] ${message}`);
    }
  }

  /**
   * Utilidad para sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generar reporte mejorado de la información extraída
   */
  generateReport(extractedData) {
    const report = {
      summary: {
        title: extractedData.content.title,
        url: extractedData.url,
        timestamp: extractedData.timestamp,
        contentLength: extractedData.metadata.length,
        hasDockerInfo: extractedData.metadata.hasDockerInfo,
        hasUpdateInfo: extractedData.metadata.hasUpdateInfo
      },
      extracted: {
        headings: extractedData.content.headings,
        dockerCommands: extractedData.n8n?.dockerCommands || [],
        updateSteps: extractedData.n8n?.updateSteps || [],
        versions: extractedData.n8n?.versions || [],
        codeBlocksCount: extractedData.content.codeBlocks.length,
        linksCount: extractedData.content.links.length
      },
      knownInfo: extractedData.n8n?.knownCommands || null,
      updateProcess: extractedData.n8n?.updateProcess || null
    };

    return report;
  }
}

// Funciones para gestión del servidor n8n
class N8NServerManager {
  constructor(sshConfig) {
    this.sshHost = sshConfig.host;
    this.sshUser = sshConfig.user;
    this.sshKey = sshConfig.key;
    this.backupDir = sshConfig.backupDir || '/tmp/n8n-backup';
  }

  /**
   * Ejecutar comando SSH en el servidor
   */
  async executeSSH(command) {
    const sshCommand = this.sshKey
      ? `ssh -i ${this.sshKey} ${this.sshUser}@${this.sshHost} "${command}"`
      : `ssh ${this.sshUser}@${this.sshHost} "${command}"`;

    console.log(`🔧 Executing: ${command}`);

    try {
      const { stdout, stderr } = await execAsync(sshCommand);
      if (stderr && !stderr.includes('Warning')) {
        console.warn(`⚠️  SSH Warning: ${stderr}`);
      }
      return stdout.trim();
    } catch (error) {
      console.error(`❌ SSH Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Hacer backup de workflows de n8n
   */
  async backupWorkflows() {
    console.log('📦 Starting n8n workflows backup...');

    try {
      // Crear directorio de backup
      await this.executeSSH(`mkdir -p ${this.backupDir}`);

      // Obtener ID del contenedor n8n
      const containerList = await this.executeSSH('docker ps --filter name=n8n --format "{{.ID}}"');
      if (!containerList) {
        throw new Error('n8n container not found');
      }

      const containerId = containerList.split('\n')[0];
      console.log(`🐳 Found n8n container: ${containerId}`);

      // Exportar todos los workflows
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = `n8n-workflows-backup-${timestamp}.json`;

      await this.executeSSH(
        `docker exec ${containerId} n8n export:workflow --all --output=/tmp/${backupFile}`
      );

      // Copiar backup fuera del contenedor
      await this.executeSSH(
        `docker cp ${containerId}:/tmp/${backupFile} ${this.backupDir}/${backupFile}`
      );

      // También hacer backup de la base de datos
      await this.executeSSH(
        `docker exec ${containerId} cp /home/node/.n8n/database.sqlite /tmp/database-backup-${timestamp}.sqlite`
      );

      await this.executeSSH(
        `docker cp ${containerId}:/tmp/database-backup-${timestamp}.sqlite ${this.backupDir}/`
      );

      console.log(`✅ Backup completed: ${this.backupDir}/${backupFile}`);
      return {
        workflowsFile: `${this.backupDir}/${backupFile}`,
        databaseFile: `${this.backupDir}/database-backup-${timestamp}.sqlite`,
        timestamp: timestamp
      };

    } catch (error) {
      console.error(`❌ Backup failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Actualizar n8n a la última versión
   */
  async updateN8N(targetVersion = 'latest') {
    console.log(`🚀 Starting n8n update to version: ${targetVersion}`);

    try {
      // Obtener información actual del contenedor
      const containerInfo = await this.executeSSH('docker ps --filter name=n8n --format "{{.ID}} {{.Image}}"');
      console.log(`📋 Current container info: ${containerInfo}`);

      // Parar el contenedor actual
      console.log('⏸️  Stopping current n8n container...');
      await this.executeSSH('docker stop n8n');

      // Descargar la nueva imagen
      console.log(`⬇️  Pulling n8n:${targetVersion} image...`);
      await this.executeSSH(`docker pull n8nio/n8n:${targetVersion}`);

      // Remover el contenedor anterior (mantener datos)
      await this.executeSSH('docker rm n8n');

      // Iniciar nuevo contenedor con la nueva imagen
      console.log('🆕 Starting new n8n container...');
      const runCommand = `docker run -d --name n8n \\
        -p 5678:5678 \\
        -v /home/cardenasever072/.n8n:/home/node/.n8n \\
        n8nio/n8n:${targetVersion}`;

      await this.executeSSH(runCommand);

      // Verificar que esté funcionando
      await this.sleep(10000); // Esperar 10 segundos
      const status = await this.executeSSH('docker ps --filter name=n8n --format "{{.Status}}"');

      if (status.includes('Up')) {
        console.log('✅ n8n updated successfully!');

        // Obtener la nueva versión
        const version = await this.executeSSH('docker exec n8n n8n --version');
        console.log(`🎉 n8n is now running version: ${version}`);

        return { success: true, version: version.trim() };
      } else {
        throw new Error('Container failed to start properly');
      }

    } catch (error) {
      console.error(`❌ Update failed: ${error.message}`);

      // Intentar restaurar el contenedor anterior si es posible
      console.log('🔄 Attempting to restore previous container...');
      try {
        await this.executeSSH('docker start n8n');
      } catch (restoreError) {
        console.error(`❌ Failed to restore: ${restoreError.message}`);
      }

      throw error;
    }
  }

  /**
   * Verificar estado del servidor n8n
   */
  async checkStatus() {
    try {
      const containerStatus = await this.executeSSH('docker ps --filter name=n8n --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"');
      const version = await this.executeSSH('docker exec n8n n8n --version 2>/dev/null || echo "Version not available"');
      const uptime = await this.executeSSH('docker exec n8n uptime 2>/dev/null || echo "Uptime not available"');

      return {
        containerStatus,
        version: version.trim(),
        uptime: uptime.trim()
      };
    } catch (error) {
      console.error(`❌ Status check failed: ${error.message}`);
      throw error;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Función principal para el script CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const extractor = new DocsInfoExtractor({
    verbose: true,
    outputDir: './docs-extracted'
  });

  const serverManager = new N8NServerManager({
    host: '159.89.51.197',
    user: 'root'
  });

  switch (command) {
    case 'fetch':
      if (!args[1]) {
        console.error('❌ Please provide a URL to fetch');
        process.exit(1);
      }

      try {
        console.log('🌐 Fetching documentation...');
        const data = await extractor.fetchDocumentation(args[1], {
          saveToFile: `extracted-${Date.now()}.json`
        });

        const report = extractor.generateReport(data);
        console.log('\n📊 EXTRACTION REPORT:');
        console.log(JSON.stringify(report, null, 2));

      } catch (error) {
        console.error(`❌ Fetch failed: ${error.message}`);
        process.exit(1);
      }
      break;

    case 'backup':
      try {
        const backup = await serverManager.backupWorkflows();
        console.log('\n✅ Backup completed successfully!');
        console.log(`📁 Workflows: ${backup.workflowsFile}`);
        console.log(`🗄️  Database: ${backup.databaseFile}`);
      } catch (error) {
        console.error(`❌ Backup failed: ${error.message}`);
        process.exit(1);
      }
      break;

    case 'update':
      try {
        // Primero hacer backup
        console.log('📦 Creating backup before update...');
        await serverManager.backupWorkflows();

        // Luego actualizar
        const version = args[1] || 'latest';
        const result = await serverManager.updateN8N(version);

        console.log('\n🎉 Update completed successfully!');
        console.log(`📋 New version: ${result.version}`);

      } catch (error) {
        console.error(`❌ Update failed: ${error.message}`);
        process.exit(1);
      }
      break;

    case 'status':
      try {
        const status = await serverManager.checkStatus();
        console.log('\n📊 N8N SERVER STATUS:');
        console.log('🐳 Container Status:');
        console.log(status.containerStatus);
        console.log(`\n📋 Version: ${status.version}`);
        console.log(`⏱️  Uptime: ${status.uptime}`);
      } catch (error) {
        console.error(`❌ Status check failed: ${error.message}`);
        process.exit(1);
      }
      break;

    case 'n8n-docs':
      try {
        console.log('📚 Fetching n8n Docker documentation...');
        const data = await extractor.fetchDocumentation(
          'https://docs.n8n.io/hosting/installation/docker/#updating',
          { saveToFile: 'n8n-docker-docs.json' }
        );

        console.log('\n🐳 DOCKER COMMANDS FOUND:');
        data.n8n?.dockerCommands.forEach((cmd, i) => {
          console.log(`${i + 1}. ${cmd}`);
        });

        console.log('\n🔄 UPDATE STEPS FOUND:');
        data.n8n?.updateSteps.forEach((step, i) => {
          console.log(`${i + 1}. ${step}`);
        });

        console.log('\n📋 VERSIONS MENTIONED:');
        data.n8n?.versions.forEach(version => {
          console.log(`- ${version}`);
        });

      } catch (error) {
        console.error(`❌ Failed to fetch n8n docs: ${error.message}`);
        process.exit(1);
      }
      break;

    default:
      console.log(`
🔧 FORESTECH DOCS FETCHER & N8N UPDATER

Usage:
  node fetch-docs-info.js <command> [options]

Commands:
  fetch <url>          Fetch and extract info from any URL
  n8n-docs            Fetch n8n Docker documentation specifically
  backup              Create backup of n8n workflows and database
  update [version]    Update n8n to specified version (default: latest)
  status              Check n8n server status

Examples:
  node fetch-docs-info.js fetch https://docs.n8n.io/hosting/installation/docker/
  node fetch-docs-info.js n8n-docs
  node fetch-docs-info.js backup
  node fetch-docs-info.js update latest
  node fetch-docs-info.js status

SSH Server: root@159.89.51.197
      `);
      break;
  }
}

// Exportar clases para uso programático
module.exports = {
  DocsInfoExtractor,
  N8NServerManager
};

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(error => {
    console.error(`❌ Script failed: ${error.message}`);
    process.exit(1);
  });
}
