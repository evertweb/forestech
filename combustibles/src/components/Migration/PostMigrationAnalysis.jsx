/**
 * PostMigrationAnalysis - Componente para análisis posterior a la migración
 * Analiza transacciones migradas y permite recálculo correcto de inventarios
 */

import React, { useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import './Migration.css';

const PostMigrationAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [_selectedProduct, setSelectedProduct] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '2023-01-01',
    end: '2025-12-31'
  });

  /**
   * Realizar análisis completo de transacciones migradas
   */
  const performCompleteAnalysis = async () => {
    setLoading(true);
    
    try {
      console.log('📊 Iniciando análisis post-migración...');
      
      // Obtener todos los movimientos migrados
      const movements = await getMigratedMovements();
      
      // Obtener todas las entradas (si las hay)
      const entries = await getMigratedEntries();
      
      // Calcular balances por producto
      const productBalances = calculateProductBalances(movements, entries);
      
      // Detectar inconsistencias
      const inconsistencies = detectInconsistencies(productBalances);
      
      // Analizar patrones de consumo
      const consumptionPatterns = analyzeConsumptionPatterns(movements);
      
      // Análisis de vehículos
      const vehicleAnalysis = analyzeVehicleConsumption(movements);
      
      const analysisResult = {
        timestamp: new Date(),
        totalMovements: movements.length,
        totalEntries: entries.length,
        productBalances,
        inconsistencies,
        consumptionPatterns,
        vehicleAnalysis,
        recommendations: generateRecommendations(productBalances, inconsistencies)
      };
      
      setAnalysis(analysisResult);
      console.log('✅ Análisis completado exitosamente');
      
    } catch (error) {
      console.error('❌ Error en análisis:', error);
      alert(`Error en análisis: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener movimientos migrados
   */
  const getMigratedMovements = async () => {
    const q = query(
      collection(db, 'combustibles_movements'),
      where('source', '==', 'historical_migration'),
      orderBy('date', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const movements = [];
    
    querySnapshot.forEach((doc) => {
      movements.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(doc.data().date)
      });
    });
    
    return movements;
  };

  /**
   * Obtener entradas migradas (si las hay)
   */
  const getMigratedEntries = async () => {
    // Buscar entradas que puedan haberse migrado
    const q = query(
      collection(db, 'combustibles_movements'),
      where('type', '==', 'entrada'),
      where('source', '==', 'historical_migration')
    );
    
    const querySnapshot = await getDocs(q);
    const entries = [];
    
    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(doc.data().date)
      });
    });
    
    return entries;
  };

  /**
   * Calcular balances por producto
   */
  const calculateProductBalances = (movements, entries) => {
    const balances = {};
    
    // Procesar entradas
    entries.forEach(entry => {
      const product = entry.productCode || entry.productType;
      if (!balances[product]) {
        balances[product] = {
          productCode: product,
          productName: entry.productName || product,
          totalEntries: 0,
          totalExits: 0,
          calculatedStock: 0,
          transactions: []
        };
      }
      
      balances[product].totalEntries += entry.quantity || 0;
      balances[product].transactions.push({
        type: 'entrada',
        date: entry.date,
        quantity: entry.quantity,
        destination: entry.destinationVehicle || 'Inventario'
      });
    });
    
    // Procesar salidas
    movements.forEach(movement => {
      const product = movement.productCode || movement.productType;
      if (!balances[product]) {
        balances[product] = {
          productCode: product,
          productName: movement.productName || product,
          totalEntries: 0,
          totalExits: 0,
          calculatedStock: 0,
          transactions: []
        };
      }
      
      balances[product].totalExits += movement.quantity || 0;
      balances[product].transactions.push({
        type: 'salida',
        date: movement.date,
        quantity: movement.quantity,
        destination: movement.destinationVehicle || movement.destinationName
      });
    });
    
    // Calcular stock calculado
    Object.values(balances).forEach(balance => {
      balance.calculatedStock = balance.totalEntries - balance.totalExits;
      balance.transactions.sort((a, b) => a.date - b.date);
    });
    
    return balances;
  };

  /**
   * Detectar inconsistencias
   */
  const detectInconsistencies = (productBalances) => {
    const inconsistencies = [];
    
    Object.values(productBalances).forEach(balance => {
      // Stock negativo
      if (balance.calculatedStock < 0) {
        inconsistencies.push({
          type: 'NEGATIVE_STOCK',
          product: balance.productCode,
          message: `Stock negativo calculado: ${balance.calculatedStock} galones`,
          severity: 'high',
          suggestedAction: 'Revisar entradas faltantes o salidas incorrectas'
        });
      }
      
      // Consumo anormal (más de 1000 galones en un solo movimiento)
      const largeMovements = balance.transactions.filter(t => t.quantity > 1000);
      if (largeMovements.length > 0) {
        inconsistencies.push({
          type: 'LARGE_MOVEMENT',
          product: balance.productCode,
          message: `${largeMovements.length} movimientos de más de 1000 galones`,
          severity: 'medium',
          suggestedAction: 'Verificar si los movimientos grandes son correctos'
        });
      }
      
      // Productos sin movimientos recientes
      const latestTransaction = balance.transactions[balance.transactions.length - 1];
      if (latestTransaction && isOlderThan6Months(latestTransaction.date)) {
        inconsistencies.push({
          type: 'OLD_MOVEMENT',
          product: balance.productCode,
          message: 'Sin movimientos en los últimos 6 meses',
          severity: 'low',
          suggestedAction: 'Verificar si el producto sigue en uso'
        });
      }
    });
    
    return inconsistencies;
  };

  /**
   * Analizar patrones de consumo
   */
  const analyzeConsumptionPatterns = (movements) => {
    const patterns = {
      byMonth: {},
      byProduct: {},
      byVehicle: {},
      trends: {}
    };
    
    movements.forEach(movement => {
      const date = movement.date;
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const product = movement.productCode || movement.productType;
      const vehicle = movement.destinationVehicle || movement.destinationName;
      
      // Por mes
      if (!patterns.byMonth[month]) patterns.byMonth[month] = 0;
      patterns.byMonth[month] += movement.quantity || 0;
      
      // Por producto
      if (!patterns.byProduct[product]) patterns.byProduct[product] = 0;
      patterns.byProduct[product] += movement.quantity || 0;
      
      // Por vehículo
      if (!patterns.byVehicle[vehicle]) patterns.byVehicle[vehicle] = 0;
      patterns.byVehicle[vehicle] += movement.quantity || 0;
    });
    
    return patterns;
  };

  /**
   * Analizar consumo por vehículo
   */
  const analyzeVehicleConsumption = (movements) => {
    const vehicleStats = {};
    
    movements.forEach(movement => {
      const vehicle = movement.destinationVehicle || movement.destinationName;
      const product = movement.productCode || movement.productType;
      
      if (!vehicleStats[vehicle]) {
        vehicleStats[vehicle] = {
          name: vehicle,
          totalConsumption: 0,
          byProduct: {},
          movementCount: 0,
          averagePerMovement: 0,
          firstMovement: movement.date,
          lastMovement: movement.date
        };
      }
      
      const stats = vehicleStats[vehicle];
      stats.totalConsumption += movement.quantity || 0;
      stats.movementCount += 1;
      
      if (!stats.byProduct[product]) stats.byProduct[product] = 0;
      stats.byProduct[product] += movement.quantity || 0;
      
      if (movement.date < stats.firstMovement) stats.firstMovement = movement.date;
      if (movement.date > stats.lastMovement) stats.lastMovement = movement.date;
    });
    
    // Calcular promedios
    Object.values(vehicleStats).forEach(stats => {
      stats.averagePerMovement = stats.totalConsumption / stats.movementCount;
    });
    
    return vehicleStats;
  };

  /**
   * Generar recomendaciones
   */
  const generateRecommendations = (productBalances, inconsistencies) => {
    const recommendations = [];
    
    // Recomendaciones basadas en inconsistencias
    if (inconsistencies.filter(i => i.type === 'NEGATIVE_STOCK').length > 0) {
      recommendations.push({
        priority: 'high',
        title: 'Corregir stocks negativos',
        description: 'Hay productos con stock negativo calculado. Revisa las entradas faltantes.',
        action: 'review_entries'
      });
    }
    
    if (inconsistencies.filter(i => i.type === 'LARGE_MOVEMENT').length > 0) {
      recommendations.push({
        priority: 'medium',
        title: 'Verificar movimientos grandes',
        description: 'Algunos movimientos son inusualmente grandes. Verifica su exactitud.',
        action: 'review_large_movements'
      });
    }
    
    // Recomendaciones de inventario
    const lowStockProducts = Object.values(productBalances).filter(b => 
      b.calculatedStock < 50 && b.calculatedStock >= 0
    );
    
    if (lowStockProducts.length > 0) {
      recommendations.push({
        priority: 'medium',
        title: 'Stock bajo detectado',
        description: `${lowStockProducts.length} productos con stock bajo (<50 galones).`,
        action: 'restock_products'
      });
    }
    
    return recommendations;
  };

  /**
   * Verificar si una fecha es anterior a 6 meses
   */
  const isOlderThan6Months = (date) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return date < sixMonthsAgo;
  };

  /**
   * Exportar resultados del análisis
   */
  const exportAnalysis = () => {
    if (!analysis) return;
    
    const exportData = {
      ...analysis,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `analisis-post-migracion-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="post-migration-analysis">
      <div className="analysis-header">
        <h2>📊 Análisis Post-Migración</h2>
        <p>Analiza las transacciones migradas y recalcula inventarios correctamente</p>
      </div>

      {/* Controles */}
      <div className="analysis-controls">
        <button 
          onClick={performCompleteAnalysis}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? '⏳ Analizando...' : '📊 Realizar Análisis Completo'}
        </button>
        
        {analysis && (
          <button onClick={exportAnalysis} className="btn-secondary">
            📄 Exportar Resultados
          </button>
        )}
      </div>

      {/* Resultados del análisis */}
      {analysis && (
        <div className="analysis-results">
          
          {/* Resumen general */}
          <div className="analysis-section">
            <h3>📋 Resumen General</h3>
            <div className="summary-stats">
              <div className="stat-card">
                <span className="stat-number">{analysis.totalMovements}</span>
                <span className="stat-label">Movimientos analizados</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{Object.keys(analysis.productBalances).length}</span>
                <span className="stat-label">Productos</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{analysis.inconsistencies.length}</span>
                <span className="stat-label">Inconsistencias</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{Object.keys(analysis.vehicleAnalysis).length}</span>
                <span className="stat-label">Vehículos/Equipos</span>
              </div>
            </div>
          </div>

          {/* Balances por producto */}
          <div className="analysis-section">
            <h3>⚖️ Balances por Producto</h3>
            <div className="product-balances">
              {Object.values(analysis.productBalances).map(balance => (
                <div key={balance.productCode} className="balance-card">
                  <h4>{balance.productName} ({balance.productCode})</h4>
                  <div className="balance-details">
                    <span className="entry">▲ Entradas: {balance.totalEntries.toFixed(1)} gal</span>
                    <span className="exit">▼ Salidas: {balance.totalExits.toFixed(1)} gal</span>
                    <span className={`stock ${balance.calculatedStock < 0 ? 'negative' : balance.calculatedStock < 50 ? 'low' : 'normal'}`}>
                      💧 Stock calculado: {balance.calculatedStock.toFixed(1)} gal
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inconsistencias */}
          {analysis.inconsistencies.length > 0 && (
            <div className="analysis-section">
              <h3>⚠️ Inconsistencias Detectadas</h3>
              <div className="inconsistencies-list">
                {analysis.inconsistencies.map((inconsistency, index) => (
                  <div key={index} className={`inconsistency-item severity-${inconsistency.severity}`}>
                    <div className="inconsistency-header">
                      <span className="inconsistency-type">{inconsistency.type}</span>
                      <span className="inconsistency-product">{inconsistency.product}</span>
                    </div>
                    <div className="inconsistency-message">{inconsistency.message}</div>
                    <div className="inconsistency-action">
                      💡 <strong>Acción sugerida:</strong> {inconsistency.suggestedAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendaciones */}
          <div className="analysis-section">
            <h3>💡 Recomendaciones</h3>
            <div className="recommendations-list">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className={`recommendation-item priority-${rec.priority}`}>
                  <h4>{rec.title}</h4>
                  <p>{rec.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top vehículos por consumo */}
          <div className="analysis-section">
            <h3>🚜 Top Vehículos por Consumo</h3>
            <div className="vehicle-ranking">
              {Object.values(analysis.vehicleAnalysis)
                .sort((a, b) => b.totalConsumption - a.totalConsumption)
                .slice(0, 10)
                .map((vehicle, index) => (
                  <div key={vehicle.name} className="vehicle-rank-item">
                    <span className="rank">#{index + 1}</span>
                    <span className="vehicle-name">{vehicle.name}</span>
                    <span className="consumption">{vehicle.totalConsumption.toFixed(1)} gal</span>
                    <span className="movements">{vehicle.movementCount} movimientos</span>
                  </div>
                ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default PostMigrationAnalysis;