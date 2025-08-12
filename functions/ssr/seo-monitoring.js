/**
 * Sistema de monitoreo y validación SEO para Forestech Colombia
 * Incluye verificación de meta tags, performance, y estructuras SEO
 */

import { generateMetaTags, generateJsonLD } from './seo-config.js';

/**
 * Validador de SEO para rutas específicas
 */
export class SEOValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.recommendations = [];
  }

  /**
   * Validar configuración SEO de una ruta
   * @param {string} route - Ruta a validar
   * @param {string} app - Aplicación (combustibles/alimentacion)
   * @param {Object} metadata - Metadata adicional
   * @returns {Object} - Resultado de validación
   */
  validate(route, app, metadata = {}) {
    this.reset();
    
    const metaTags = generateMetaTags(route, app);
    const jsonLD = generateJsonLD(route, app);
    
    // Validaciones críticas
    this.validateTitle(metaTags.title);
    this.validateDescription(metaTags.description);
    this.validateKeywords(metaTags.keywords);
    this.validateOpenGraph(metaTags);
    this.validateStructuredData(jsonLD);
    this.validateCanonical(metaTags.canonical);
    
    // Validaciones de performance SEO
    this.validateImages(metaTags);
    this.validateInternationalization(metaTags);
    
    return {
      isValid: this.errors.length === 0,
      score: this.calculateSEOScore(),
      errors: this.errors,
      warnings: this.warnings,
      recommendations: this.recommendations,
      metaTags,
      jsonLD
    };
  }

  reset() {
    this.errors = [];
    this.warnings = [];
    this.recommendations = [];
  }

  validateTitle(title) {
    if (!title) {
      this.errors.push('Título faltante');
      return;
    }
    
    if (title.length < 30) {
      this.warnings.push('Título demasiado corto (< 30 caracteres)');
    }
    
    if (title.length > 60) {
      this.warnings.push('Título demasiado largo (> 60 caracteres)');
    }
    
    if (!title.includes('Forestech')) {
      this.recommendations.push('Considerar incluir "Forestech" en el título');
    }
  }

  validateDescription(description) {
    if (!description) {
      this.errors.push('Descripción faltante');
      return;
    }
    
    if (description.length < 120) {
      this.warnings.push('Descripción demasiado corta (< 120 caracteres)');
    }
    
    if (description.length > 160) {
      this.warnings.push('Descripción demasiado larga (> 160 caracteres)');
    }
  }

  validateKeywords(keywords) {
    if (!keywords) {
      this.warnings.push('Palabras clave faltantes');
      return;
    }
    
    const keywordArray = keywords.split(',').map(k => k.trim());
    
    if (keywordArray.length < 3) {
      this.recommendations.push('Agregar más palabras clave (mínimo 3)');
    }
    
    if (keywordArray.length > 10) {
      this.warnings.push('Demasiadas palabras clave (> 10)');
    }
  }

  validateOpenGraph(metaTags) {
    const requiredOGTags = ['og:title', 'og:description', 'og:image', 'og:url'];
    
    requiredOGTags.forEach(tag => {
      if (!metaTags[tag]) {
        this.warnings.push(`Tag Open Graph faltante: ${tag}`);
      }
    });
    
    if (metaTags['og:image'] && !metaTags['og:image'].startsWith('https://')) {
      this.errors.push('Imagen Open Graph debe usar HTTPS');
    }
  }

  validateStructuredData(jsonLD) {
    if (!jsonLD) {
      this.warnings.push('Datos estructurados (JSON-LD) faltantes');
      return;
    }
    
    if (!jsonLD['@context']) {
      this.errors.push('Context de Schema.org faltante en JSON-LD');
    }
    
    if (!jsonLD['@type']) {
      this.errors.push('Tipo de Schema.org faltante en JSON-LD');
    }
  }

  validateCanonical(canonical) {
    if (!canonical) {
      this.warnings.push('URL canónica faltante');
      return;
    }
    
    if (!canonical.startsWith('https://')) {
      this.errors.push('URL canónica debe usar HTTPS');
    }
  }

  validateImages(metaTags) {
    if (metaTags['og:image']) {
      if (!metaTags['og:image'].includes('.webp') && !metaTags['og:image'].includes('.jpg')) {
        this.recommendations.push('Usar formato WebP o JPEG optimizado para imágenes');
      }
    }
  }

  validateInternationalization(metaTags) {
    if (!metaTags['og:locale']) {
      this.warnings.push('Locale faltante para internacionalización');
    }
    
    if (metaTags['og:locale'] && !metaTags['og:locale'].includes('es')) {
      this.warnings.push('Locale debería estar en español (es_CO)');
    }
  }

  calculateSEOScore() {
    let score = 100;
    
    // Penalizaciones por errores
    score -= this.errors.length * 20;
    
    // Penalizaciones por advertencias
    score -= this.warnings.length * 10;
    
    // Penalizaciones menores por recomendaciones
    score -= this.recommendations.length * 5;
    
    return Math.max(0, score);
  }
}

/**
 * Verificador de performance SEO
 */
export class SEOPerformanceChecker {
  
  /**
   * Verificar Core Web Vitals relacionados con SEO
   * @param {Object} metrics - Métricas de performance
   * @returns {Object} - Análisis de performance SEO
   */
  checkCoreWebVitals(metrics = {}) {
    const issues = [];
    const recommendations = [];
    
    // Largest Contentful Paint (LCP)
    if (metrics.lcp > 2500) {
      issues.push('LCP muy lento (> 2.5s) - afecta ranking SEO');
      recommendations.push('Optimizar imágenes y recursos críticos');
    }
    
    // First Input Delay (FID)
    if (metrics.fid > 100) {
      issues.push('FID alto (> 100ms) - afecta experiencia de usuario');
      recommendations.push('Reducir JavaScript de bloqueo');
    }
    
    // Cumulative Layout Shift (CLS)
    if (metrics.cls > 0.1) {
      issues.push('CLS alto (> 0.1) - contenido inestable');
      recommendations.push('Definir dimensiones de imágenes y evitar contenido dinámico');
    }
    
    return {
      score: this.calculatePerformanceScore(metrics),
      issues,
      recommendations,
      coreWebVitalsPass: metrics.lcp <= 2500 && metrics.fid <= 100 && metrics.cls <= 0.1
    };
  }
  
  calculatePerformanceScore(metrics) {
    let score = 100;
    
    if (metrics.lcp > 2500) score -= 30;
    if (metrics.fid > 100) score -= 25;
    if (metrics.cls > 0.1) score -= 25;
    
    return Math.max(0, score);
  }
}

/**
 * Generador de reportes SEO
 */
export class SEOReporter {
  
  /**
   * Generar reporte completo de SEO
   * @param {Array} validationResults - Resultados de validación por ruta
   * @param {Object} performanceData - Datos de performance
   * @returns {Object} - Reporte completo
   */
  generateReport(validationResults = [], performanceData = {}) {
    const totalRoutes = validationResults.length;
    const validRoutes = validationResults.filter(r => r.isValid).length;
    
    const averageScore = totalRoutes > 0 
      ? validationResults.reduce((sum, r) => sum + r.score, 0) / totalRoutes 
      : 0;
    
    const allErrors = validationResults.flatMap(r => r.errors);
    const allWarnings = validationResults.flatMap(r => r.warnings);
    const allRecommendations = validationResults.flatMap(r => r.recommendations);
    
    return {
      summary: {
        totalRoutes,
        validRoutes,
        validationRate: totalRoutes > 0 ? (validRoutes / totalRoutes * 100).toFixed(1) : 0,
        averageScore: averageScore.toFixed(1),
        timestamp: new Date().toISOString()
      },
      issues: {
        errors: this.groupIssues(allErrors),
        warnings: this.groupIssues(allWarnings),
        recommendations: this.groupIssues(allRecommendations)
      },
      performance: performanceData,
      routes: validationResults,
      recommendations: this.generateGlobalRecommendations(validationResults)
    };
  }
  
  groupIssues(issues) {
    const grouped = {};
    issues.forEach(issue => {
      grouped[issue] = (grouped[issue] || 0) + 1;
    });
    
    return Object.entries(grouped)
      .map(([issue, count]) => ({ issue, count }))
      .sort((a, b) => b.count - a.count);
  }
  
  generateGlobalRecommendations(validationResults) {
    const recommendations = [];
    
    const avgScore = validationResults.reduce((sum, r) => sum + r.score, 0) / validationResults.length;
    
    if (avgScore < 80) {
      recommendations.push({
        priority: 'high',
        action: 'Mejorar meta tags básicos (título y descripción)',
        impact: 'Alto impacto en rankings de búsqueda'
      });
    }
    
    const missingImages = validationResults.filter(r => 
      !r.metaTags['og:image']
    ).length;
    
    if (missingImages > 0) {
      recommendations.push({
        priority: 'medium',
        action: 'Agregar imágenes Open Graph a todas las rutas',
        impact: 'Mejora compartir en redes sociales'
      });
    }
    
    return recommendations;
  }
}

// Instancias globales
export const seoValidator = new SEOValidator();
export const seoPerformanceChecker = new SEOPerformanceChecker();
export const seoReporter = new SEOReporter();
