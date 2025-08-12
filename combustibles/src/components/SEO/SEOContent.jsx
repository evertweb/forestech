/**
 * SEOContent - Componente con contenido optimizado para SEO
 * Incluye texto visible para motores de búsqueda pero estilizado para no molestar la UX
 */

import React from 'react';

const SEOContent = ({ className = '' }) => {
  return (
    <div className={`seo-content ${className}`}>
      {/* Texto principal para SEO - visible pero estilizado */}
      <div className="seo-main-content">
        <h1
          style={{
            fontSize: '0px',
            height: '0px',
            overflow: 'hidden',
            position: 'absolute',
            left: '-9999px',
          }}
        >
          Forestech de Colombia - Sistema de Gestión de Combustibles
        </h1>

        {/* Contenido estructurado para SEO */}
        <div style={{ display: 'none' }}>
          <h2>Sistema Integral de Combustibles para Empresas en Colombia</h2>
          <p>
            Forestech de Colombia ofrece la solución más completa para la gestión de combustibles,
            inventario vehicular y mantenimiento de flotas en Colombia. Nuestro sistema permite el
            control total de su operación logística.
          </p>

          <h3>Funcionalidades Principales</h3>
          <ul>
            <li>Gestión completa de inventario de combustibles</li>
            <li>Control y seguimiento de vehículos y equipos</li>
            <li>Programación y control de mantenimiento</li>
            <li>Sistema de movimientos y transacciones</li>
            <li>Gestión de proveedores y suministros</li>
            <li>Reportes avanzados y análisis empresarial</li>
            <li>Dashboard ejecutivo con métricas en tiempo real</li>
          </ul>

          <h3>Beneficios para Su Empresa</h3>
          <ul>
            <li>Reducción de costos operativos</li>
            <li>Optimización del consumo de combustible</li>
            <li>Control total del inventario</li>
            <li>Mantenimiento preventivo efectivo</li>
            <li>Reportes empresariales detallados</li>
            <li>Cumplimiento normativo en Colombia</li>
          </ul>

          <h3>Sectores Empresariales</h3>
          <p>
            Ideal para empresas de transporte, logística, construcción, minería, agricultura y
            cualquier sector que requiera gestión eficiente de combustibles y flotas vehiculares en
            Colombia.
          </p>

          <div>
            <strong>Palabras clave:</strong> forestech colombia, gestión combustibles, sistema
            logística colombia, control vehicular, inventario combustible, mantenimiento flota,
            forestech de colombia, combustibles empresa colombia
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOContent;
