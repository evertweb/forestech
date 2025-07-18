#!/usr/bin/env node

/**
 * 🐚 Shell Optimizer - Forestech
 * Optimización de shell operations con in-memory snapshots
 * 
 * Características:
 * - In-memory file system snapshots
 * - Builds paralelos optimizados
 * - Operaciones shell consistentes
 * - Cache inteligente de estado
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

class ShellOptimizer {
  constructor() {
    this.workingDir = process.env.PWD || process.cwd();
    this.memorySnapshot = new Map();
    this.commandQueue = [];
    this.isProcessing = false;
    this.config = this.loadConfig();
  }

  loadConfig() {
    return {
      enableSnapshot: true,
      parallelBuilds: true,
      cacheTimeout: 300000, // 5 minutes
      maxParallelJobs: 4,
      optimizedCommands: [
        'npm run dev:combustibles',
        'npm run dev:alimentacion',
        'npm run lint:combustibles',
        'npm run lint:alimentacion',
        'npm run build:combustibles',
        'npm run build:alimentacion'
      ]
    };
  }

  // Create in-memory snapshot of current file system state
  createSnapshot() {
    if (!this.config.enableSnapshot) return;

    const snapshotTime = Date.now();
    const snapshot = {
      timestamp: snapshotTime,
      files: new Map(),
      directories: new Set(),
      gitStatus: null
    };

    // Capture key files
    const keyPaths = [
      'package.json',
      'combustibles/package.json',
      'alimentacion/package.json',
      'combustibles/src',
      'alimentacion/src',
      'shared/src',
      'firebase.json',
      '.git'
    ];

    keyPaths.forEach(relativePath => {
      const fullPath = path.join(this.workingDir, relativePath);
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          snapshot.directories.add(fullPath);
          this.captureDirectorySnapshot(fullPath, snapshot.files);
        } else {
          snapshot.files.set(fullPath, {
            mtime: stats.mtime,
            size: stats.size,
            content: fs.readFileSync(fullPath, 'utf8')
          });
        }
      }
    });

    // Capture git status
    this.captureGitStatus().then(status => {
      snapshot.gitStatus = status;
    });

    this.memorySnapshot.set('latest', snapshot);
    console.log(`📸 Snapshot created: ${snapshot.files.size} files, ${snapshot.directories.size} directories`);
  }

  captureDirectorySnapshot(dirPath, filesMap) {
    try {
      const items = fs.readdirSync(dirPath);
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isFile() && this.shouldCaptureFile(item)) {
          filesMap.set(itemPath, {
            mtime: stats.mtime,
            size: stats.size,
            content: fs.readFileSync(itemPath, 'utf8')
          });
        } else if (stats.isDirectory() && this.shouldCaptureDirectory(item)) {
          this.captureDirectorySnapshot(itemPath, filesMap);
        }
      });
    } catch (error) {
      console.warn(`⚠️  Error capturing directory ${dirPath}:`, error.message);
    }
  }

  shouldCaptureFile(filename) {
    const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.html'];
    const skipFiles = ['node_modules', '.git', 'dist', 'build'];
    
    return extensions.some(ext => filename.endsWith(ext)) && 
           !skipFiles.some(skip => filename.includes(skip));
  }

  shouldCaptureDirectory(dirname) {
    const skipDirs = ['node_modules', '.git', 'dist', 'build', '.cache'];
    return !skipDirs.includes(dirname);
  }

  async captureGitStatus() {
    return new Promise((resolve) => {
      exec('git status --porcelain', { cwd: this.workingDir }, (error, stdout, stderr) => {
        if (error) {
          resolve(null);
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }

  // Execute optimized parallel builds
  async executeParallelBuilds() {
    if (!this.config.parallelBuilds) return;

    const builds = [
      {
        name: 'combustibles',
        command: 'npm run dev:combustibles',
        cwd: path.join(this.workingDir, 'combustibles')
      },
      {
        name: 'alimentacion', 
        command: 'npm run dev:alimentacion',
        cwd: path.join(this.workingDir, 'alimentacion')
      }
    ];

    console.log('🚀 Starting parallel builds...');
    
    const buildPromises = builds.map(build => this.executeBuild(build));
    
    try {
      const results = await Promise.all(buildPromises);
      console.log('✅ All builds completed successfully');
      return results;
    } catch (error) {
      console.error('❌ Build failed:', error);
      throw error;
    }
  }

  executeBuild(buildConfig) {
    return new Promise((resolve, reject) => {
      console.log(`🔨 Building ${buildConfig.name}...`);
      
      const process = spawn('npm', ['run', `dev:${buildConfig.name}`], {
        cwd: this.workingDir,
        stdio: 'pipe'
      });

      let output = '';
      let errorOutput = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ ${buildConfig.name} build completed`);
          resolve({ name: buildConfig.name, output, success: true });
        } else {
          console.error(`❌ ${buildConfig.name} build failed with code ${code}`);
          reject({ name: buildConfig.name, error: errorOutput, code });
        }
      });
    });
  }

  // Queue commands for optimized execution
  queueCommand(command, options = {}) {
    const commandInfo = {
      id: Date.now() + Math.random(),
      command,
      options,
      timestamp: Date.now(),
      status: 'queued'
    };

    this.commandQueue.push(commandInfo);
    console.log(`📋 Command queued: ${command}`);
    
    if (!this.isProcessing) {
      this.processQueue();
    }
    
    return commandInfo.id;
  }

  async processQueue() {
    if (this.isProcessing || this.commandQueue.length === 0) return;
    
    this.isProcessing = true;
    console.log(`🔄 Processing ${this.commandQueue.length} commands...`);
    
    while (this.commandQueue.length > 0) {
      const command = this.commandQueue.shift();
      command.status = 'processing';
      
      try {
        const result = await this.executeCommand(command);
        command.status = 'completed';
        command.result = result;
        console.log(`✅ Command completed: ${command.command}`);
      } catch (error) {
        command.status = 'failed';
        command.error = error;
        console.error(`❌ Command failed: ${command.command} - ${error.message}`);
      }
    }
    
    this.isProcessing = false;
    console.log('✅ All commands processed');
  }

  executeCommand(commandInfo) {
    return new Promise((resolve, reject) => {
      const { command, options } = commandInfo;
      
      exec(command, {
        cwd: this.workingDir,
        ...options
      }, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }

  // Get file system consistency check
  checkConsistency() {
    const snapshot = this.memorySnapshot.get('latest');
    if (!snapshot) return { consistent: true, changes: [] };

    const changes = [];
    
    snapshot.files.forEach((fileInfo, filePath) => {
      if (fs.existsSync(filePath)) {
        const currentStats = fs.statSync(filePath);
        if (currentStats.mtime.getTime() !== fileInfo.mtime.getTime()) {
          changes.push({
            file: filePath,
            type: 'modified',
            snapshotTime: fileInfo.mtime,
            currentTime: currentStats.mtime
          });
        }
      } else {
        changes.push({
          file: filePath,
          type: 'deleted'
        });
      }
    });

    return {
      consistent: changes.length === 0,
      changes
    };
  }

  // Initialize shell optimization
  async initialize() {
    console.log('🚀 Initializing Shell Optimizer...');
    
    // Create initial snapshot
    this.createSnapshot();
    
    // Set up periodic snapshot updates
    setInterval(() => {
      this.createSnapshot();
    }, this.config.cacheTimeout);
    
    console.log('✅ Shell Optimizer initialized');
  }
}

// Main execution
async function main() {
  const optimizer = new ShellOptimizer();
  await optimizer.initialize();
  
  // Example: Execute parallel builds
  if (process.argv.includes('--parallel-builds')) {
    await optimizer.executeParallelBuilds();
  }
  
  // Example: Check consistency
  if (process.argv.includes('--check-consistency')) {
    const consistency = optimizer.checkConsistency();
    console.log('📊 Consistency check:', consistency);
  }
  
  return optimizer;
}

// Execute if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ShellOptimizer, main };