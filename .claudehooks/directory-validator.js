#!/usr/bin/env node

/**
 * 🔒 Directory Validator - Forestech
 * Configuración de validaciones específicas por directorio
 * 
 * Características:
 * - Validaciones específicas por app (combustibles/alimentacion)
 * - Reglas de negocio contextuales
 * - Verificaciones de integridad
 * - Prevención de operaciones peligrosas
 */

const fs = require('fs');
const path = require('path');

class DirectoryValidator {
  constructor() {
    this.workingDir = process.env.PWD || process.cwd();
    this.validationRules = this.loadValidationRules();
    this.context = this.detectContext();
  }

  detectContext() {
    const dirPath = this.workingDir;
    
    if (dirPath.includes('combustibles')) {
      return 'combustibles';
    } else if (dirPath.includes('alimentacion')) {
      return 'alimentacion';
    } else if (dirPath.includes('shared')) {
      return 'shared';
    } else {
      return 'general';
    }
  }

  loadValidationRules() {
    return {
      combustibles: {
        requiredFiles: [
          'src/components/Vehicles/VehiclesMain.jsx',
          'src/services/vehiclesService.js',
          'src/data/vehicleCategories.js',
          'package.json'
        ],
        forbiddenOperations: [
          'deleteAllCategories',
          'truncateVehicles',
          'dropDatabase'
        ],
        businessRules: {
          maxVehicleCategories: 50,
          maxVehiclesPerCategory: 1000,
          requiredCategoryFields: ['name', 'fuelType', 'icon', 'color'],
          allowedFuelTypes: ['gasoline', 'diesel', 'electric', 'hybrid'],
          minCategoryNameLength: 3,
          maxCategoryNameLength: 50
        },
        filePatterns: {
          components: /^src\/components\/Vehicles\/.*\.jsx?$/,
          services: /^src\/services\/.*Service\.js$/,
          data: /^src\/data\/.*\.js$/,
          styles: /^src\/.*\.css$/
        },
        codePatterns: {
          forbidden: [
            /console\.log\(/,
            /alert\(/,
            /localStorage\.clear\(/,
            /sessionStorage\.clear\(/,
            /window\.location\.reload\(/
          ],
          required: [
            /PropTypes\./,
            /useState\(/,
            /useEffect\(/
          ]
        }
      },
      
      alimentacion: {
        requiredFiles: [
          'src/components/Liquidaciones/LiquidacionesMain.jsx',
          'src/services/liquidacionesService.js',
          'src/data/empleados.js',
          'package.json'
        ],
        forbiddenOperations: [
          'deleteAllEmpleados',
          'truncateLiquidaciones',
          'resetSalarios'
        ],
        businessRules: {
          maxEmpleados: 1000,
          maxLiquidacionesPorEmpleado: 50,
          requiredEmpleadoFields: ['cedula', 'nombre', 'cargo', 'salario'],
          minSalario: 1000000, // Salario mínimo Colombia
          maxSalario: 50000000,
          requiredLiquidacionFields: ['empleadoId', 'periodo', 'conceptos', 'total']
        },
        filePatterns: {
          components: /^src\/components\/Liquidaciones\/.*\.jsx?$/,
          services: /^src\/services\/.*Service\.js$/,
          data: /^src\/data\/.*\.js$/,
          styles: /^src\/.*\.css$/
        },
        codePatterns: {
          forbidden: [
            /console\.log\(/,
            /alert\(/,
            /Math\.random\(/,
            /Date\.now\(/
          ],
          required: [
            /PropTypes\./,
            /formatCurrency\(/,
            /validateCedula\(/
          ]
        }
      },
      
      shared: {
        requiredFiles: [
          'src/components/Shared/ForestechFormWizard.jsx',
          'src/hooks/useFirebase.js',
          'src/utils/formatters.js',
          'package.json'
        ],
        forbiddenOperations: [
          'breakingChange',
          'removePublicAPI',
          'changePropTypes'
        ],
        businessRules: {
          maxComponentProps: 20,
          maxHookDependencies: 10,
          requiredPropTypes: true,
          requiredDefaultProps: true,
          maxUtilityFunctions: 50
        },
        filePatterns: {
          components: /^src\/components\/Shared\/.*\.jsx?$/,
          hooks: /^src\/hooks\/.*\.js$/,
          utils: /^src\/utils\/.*\.js$/,
          styles: /^src\/.*\.css$/
        },
        codePatterns: {
          forbidden: [
            /console\.log\(/,
            /alert\(/,
            /document\.getElementById\(/,
            /window\./
          ],
          required: [
            /PropTypes\./,
            /export default/,
            /import.*from/
          ]
        }
      },
      
      general: {
        requiredFiles: [
          'package.json',
          'firebase.json',
          '.gitignore',
          'README.md'
        ],
        forbiddenOperations: [
          'deleteMonorepo',
          'removeFirebaseConfig',
          'deleteDotGit'
        ],
        businessRules: {
          maxApps: 10,
          requiredApps: ['combustibles', 'alimentacion'],
          maxDependencies: 100,
          requiredScripts: ['dev', 'build', 'lint']
        },
        filePatterns: {
          config: /^.*\.json$/,
          documentation: /^.*\.md$/,
          scripts: /^scripts\/.*\.sh$/,
          workflows: /^\.github\/workflows\/.*\.yml$/
        },
        codePatterns: {
          forbidden: [
            /api.*key/i,
            /secret/i,
            /password/i,
            /token.*=/i
          ],
          required: []
        }
      }
    };
  }

  // Validación principal
  validateDirectory(operation = 'general') {
    const rules = this.validationRules[this.context] || this.validationRules.general;
    const results = {
      valid: true,
      warnings: [],
      errors: [],
      context: this.context,
      operation: operation
    };

    // 1. Validar archivos requeridos
    const fileValidation = this.validateRequiredFiles(rules.requiredFiles);
    if (!fileValidation.valid) {
      results.valid = false;
      results.errors.push(...fileValidation.errors);
    }
    results.warnings.push(...fileValidation.warnings);

    // 2. Validar operaciones prohibidas
    const operationValidation = this.validateOperation(operation, rules.forbiddenOperations);
    if (!operationValidation.valid) {
      results.valid = false;
      results.errors.push(...operationValidation.errors);
    }

    // 3. Validar reglas de negocio
    const businessValidation = this.validateBusinessRules(rules.businessRules);
    if (!businessValidation.valid) {
      results.valid = false;
      results.errors.push(...businessValidation.errors);
    }
    results.warnings.push(...businessValidation.warnings);

    // 4. Validar patrones de código
    const codeValidation = this.validateCodePatterns(rules.codePatterns);
    if (!codeValidation.valid) {
      results.valid = false;
      results.errors.push(...codeValidation.errors);
    }
    results.warnings.push(...codeValidation.warnings);

    return results;
  }

  validateRequiredFiles(requiredFiles) {
    const results = { valid: true, warnings: [], errors: [] };
    
    requiredFiles.forEach(file => {
      const filePath = path.join(this.workingDir, file);
      if (!fs.existsSync(filePath)) {
        results.valid = false;
        results.errors.push(`Required file missing: ${file}`);
      } else {
        // Verificar que el archivo no esté vacío
        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
          results.warnings.push(`Required file is empty: ${file}`);
        }
      }
    });

    return results;
  }

  validateOperation(operation, forbiddenOperations) {
    const results = { valid: true, errors: [] };
    
    if (forbiddenOperations.includes(operation)) {
      results.valid = false;
      results.errors.push(`Forbidden operation: ${operation} not allowed in ${this.context}`);
    }

    return results;
  }

  validateBusinessRules(businessRules) {
    const results = { valid: true, warnings: [], errors: [] };
    
    if (this.context === 'combustibles') {
      results.warnings.push(...this.validateCombustiblesRules(businessRules));
    } else if (this.context === 'alimentacion') {
      results.warnings.push(...this.validateAlimentacionRules(businessRules));
    } else if (this.context === 'shared') {
      results.warnings.push(...this.validateSharedRules(businessRules));
    }

    return results;
  }

  validateCombustiblesRules(rules) {
    const warnings = [];
    
    // Validar categorías existentes
    const categoriesFile = path.join(this.workingDir, 'src/data/vehicleCategories.js');
    if (fs.existsSync(categoriesFile)) {
      try {
        const content = fs.readFileSync(categoriesFile, 'utf8');
        const categoryCount = (content.match(/\{[^}]+\}/g) || []).length;
        
        if (categoryCount > rules.maxVehicleCategories) {
          warnings.push(`Too many vehicle categories: ${categoryCount} > ${rules.maxVehicleCategories}`);
        }
        
        // Validar tipos de combustible
        rules.allowedFuelTypes.forEach(fuelType => {
          if (!content.includes(fuelType)) {
            warnings.push(`Missing fuel type configuration: ${fuelType}`);
          }
        });
      } catch (error) {
        warnings.push(`Error reading vehicle categories: ${error.message}`);
      }
    }

    return warnings;
  }

  validateAlimentacionRules(rules) {
    const warnings = [];
    
    // Validar empleados
    const empleadosFile = path.join(this.workingDir, 'src/data/empleados.js');
    if (fs.existsSync(empleadosFile)) {
      try {
        const content = fs.readFileSync(empleadosFile, 'utf8');
        const empleadoCount = (content.match(/cedula:/g) || []).length;
        
        if (empleadoCount > rules.maxEmpleados) {
          warnings.push(`Too many empleados: ${empleadoCount} > ${rules.maxEmpleados}`);
        }
        
        // Validar campos requeridos
        rules.requiredEmpleadoFields.forEach(field => {
          if (!content.includes(field)) {
            warnings.push(`Missing required empleado field: ${field}`);
          }
        });
      } catch (error) {
        warnings.push(`Error reading empleados data: ${error.message}`);
      }
    }

    return warnings;
  }

  validateSharedRules(rules) {
    const warnings = [];
    
    // Validar componentes compartidos
    const sharedDir = path.join(this.workingDir, 'src/components/Shared');
    if (fs.existsSync(sharedDir)) {
      try {
        const files = fs.readdirSync(sharedDir);
        const componentCount = files.filter(f => f.endsWith('.jsx')).length;
        
        if (componentCount > rules.maxComponentProps) {
          warnings.push(`Too many shared components: ${componentCount}`);
        }
      } catch (error) {
        warnings.push(`Error reading shared components: ${error.message}`);
      }
    }

    return warnings;
  }

  validateCodePatterns(codePatterns) {
    const results = { valid: true, warnings: [], errors: [] };
    
    if (!codePatterns) return results;

    // Buscar archivos de código
    const codeFiles = this.findCodeFiles();
    
    codeFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Verificar patrones prohibidos
        if (codePatterns.forbidden) {
          codePatterns.forbidden.forEach(pattern => {
            if (pattern.test(content)) {
              results.warnings.push(`Forbidden pattern found in ${path.basename(file)}: ${pattern}`);
            }
          });
        }
        
        // Verificar patrones requeridos
        if (codePatterns.required) {
          codePatterns.required.forEach(pattern => {
            if (!pattern.test(content)) {
              results.warnings.push(`Required pattern missing in ${path.basename(file)}: ${pattern}`);
            }
          });
        }
      } catch (error) {
        results.warnings.push(`Error reading file ${file}: ${error.message}`);
      }
    });

    return results;
  }

  findCodeFiles() {
    const codeFiles = [];
    const extensions = ['.js', '.jsx', '.ts', '.tsx'];
    
    const searchDir = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory() && !item.includes('node_modules')) {
          searchDir(itemPath);
        } else if (stats.isFile() && extensions.some(ext => item.endsWith(ext))) {
          codeFiles.push(itemPath);
        }
      });
    };
    
    searchDir(path.join(this.workingDir, 'src'));
    return codeFiles;
  }

  // Validaciones específicas por tipo de operación
  validateFileOperation(operation, filePath) {
    const rules = this.validationRules[this.context] || this.validationRules.general;
    const results = { valid: true, warnings: [], errors: [] };

    // Validar que el archivo siga los patrones esperados
    const fileName = path.basename(filePath);
    const relativePath = path.relative(this.workingDir, filePath);
    
    let matchesPattern = false;
    Object.entries(rules.filePatterns).forEach(([type, pattern]) => {
      if (pattern.test(relativePath)) {
        matchesPattern = true;
        
        // Validaciones específicas por tipo
        if (type === 'components' && !fileName.includes('jsx')) {
          results.warnings.push(`Component file should use .jsx extension: ${fileName}`);
        }
        
        if (type === 'services' && !fileName.includes('Service')) {
          results.warnings.push(`Service file should include 'Service' in name: ${fileName}`);
        }
      }
    });

    if (!matchesPattern) {
      results.warnings.push(`File doesn't match expected patterns: ${relativePath}`);
    }

    return results;
  }

  // Validación antes de commits
  validateBeforeCommit() {
    const results = { valid: true, warnings: [], errors: [] };
    
    // Validar estado general
    const directoryValidation = this.validateDirectory('commit');
    results.valid = results.valid && directoryValidation.valid;
    results.warnings.push(...directoryValidation.warnings);
    results.errors.push(...directoryValidation.errors);

    // Validar que no haya archivos temporales
    const tempFiles = this.findTemporaryFiles();
    if (tempFiles.length > 0) {
      results.warnings.push(`Temporary files found: ${tempFiles.join(', ')}`);
    }

    // Validar que no haya archivos de gran tamaño
    const largeFiles = this.findLargeFiles();
    if (largeFiles.length > 0) {
      results.warnings.push(`Large files found: ${largeFiles.join(', ')}`);
    }

    return results;
  }

  findTemporaryFiles() {
    const tempFiles = [];
    const tempPatterns = ['.tmp', '.temp', '.bak', '.swp', '.log'];
    
    const searchDir = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory() && !item.includes('node_modules')) {
          searchDir(itemPath);
        } else if (stats.isFile() && tempPatterns.some(pattern => item.includes(pattern))) {
          tempFiles.push(path.relative(this.workingDir, itemPath));
        }
      });
    };
    
    searchDir(this.workingDir);
    return tempFiles;
  }

  findLargeFiles() {
    const largeFiles = [];
    const maxSize = 1024 * 1024; // 1MB
    
    const searchDir = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory() && !item.includes('node_modules')) {
          searchDir(itemPath);
        } else if (stats.isFile() && stats.size > maxSize) {
          largeFiles.push(path.relative(this.workingDir, itemPath));
        }
      });
    };
    
    searchDir(this.workingDir);
    return largeFiles;
  }

  // Generar reporte de validación
  generateValidationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      context: this.context,
      workingDirectory: this.workingDir,
      validation: this.validateDirectory(),
      fileOperationCheck: this.validateBeforeCommit(),
      summary: {
        totalWarnings: 0,
        totalErrors: 0,
        critical: false
      }
    };

    // Calcular totales
    report.summary.totalWarnings = report.validation.warnings.length + report.fileOperationCheck.warnings.length;
    report.summary.totalErrors = report.validation.errors.length + report.fileOperationCheck.errors.length;
    report.summary.critical = report.summary.totalErrors > 0;

    return report;
  }
}

// Main execution
function main() {
  const validator = new DirectoryValidator();
  const operation = process.argv[2] || 'general';
  
  console.log('🔒 Directory Validator - Forestech');
  console.log(`📁 Context: ${validator.context}`);
  console.log(`🔧 Operation: ${operation}`);
  
  const validation = validator.validateDirectory(operation);
  
  console.log('\n📊 Validation Results:');
  console.log(`✅ Valid: ${validation.valid}`);
  console.log(`⚠️  Warnings: ${validation.warnings.length}`);
  console.log(`❌ Errors: ${validation.errors.length}`);
  
  if (validation.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    validation.warnings.forEach(warning => console.log(`   - ${warning}`));
  }
  
  if (validation.errors.length > 0) {
    console.log('\n❌ Errors:');
    validation.errors.forEach(error => console.log(`   - ${error}`));
  }
  
  if (process.argv.includes('--report')) {
    const report = validator.generateValidationReport();
    console.log('\n📋 Full Report:', JSON.stringify(report, null, 2));
  }
  
  return validation;
}

// Execute if called directly
if (require.main === module) {
  main();
}

module.exports = { DirectoryValidator, main };