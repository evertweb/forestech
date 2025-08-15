/**
 * VehicleCategoriesManager - Gestión de categorías de vehículos personalizables
 * Permite crear, editar y eliminar categorías dinámicamente
 */

import React, { useState, useEffect } from 'react';
import {
  createCategory,
  getAllVehicleCategories,
  deleteCategory,
  subscribeToCategories,
  getCategoryStats,
} from '../../services/vehicleCategoriesService';
import {
  resetVehicleCategories,
  hasCustomCategories,
} from '../../services/resetVehicleCategoriesService';
import {
  isCustomIcon,
  renderCategoryIcon,
  deleteCategoryIcon,
} from '../../services/iconUploadService.jsx';
import { AVAILABLE_FIELDS } from '../../data/vehicleCategories';
import './VehicleCategoriesManager.css';

const VehicleCategoriesManager = ({ onClose, onCategoryCreated, embedded = false }) => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [hasCustom, setHasCustom] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, _setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategoriesAndStats();
    checkCustomCategories();

    // Suscribirse a cambios en tiempo real
    const unsubscribe = subscribeToCategories((updatedCategories) => {
      setCategories(updatedCategories);
      loadStats();
      checkCustomCategories();
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  const loadCategoriesAndStats = async () => {
    try {
      setLoading(true);
      const [categoriesData, statsData] = await Promise.all([
        getAllVehicleCategories(),
        getCategoryStats(),
      ]);
      setCategories(categoriesData);
      setStats(statsData);
    } catch (error) {
      console.error('❌ Error cargando categorías:', error);
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getCategoryStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const checkCustomCategories = async () => {
    try {
      const hasCustomCats = await hasCustomCategories();
      setHasCustom(hasCustomCats);
    } catch (error) {
      console.error('❌ Error verificando categorías personalizadas:', error);
    }
  };

  const handleEditCategory = (category) => {
    // TODO: Implementar edición usando el mismo modal DOM directo
    console.log('Editar categoría:', category);
    alert('Función de edición en desarrollo. Usa "Eliminar" y crear nueva por ahora.');
  };

  const handleDeleteCategory = async (category) => {
    console.log('🗑️ Intentando eliminar categoría:', category);

    const confirmed = window.confirm(
      `¿Está seguro de eliminar la categoría "${category.name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmed) {
      console.log('❌ Eliminación cancelada por el usuario');
      return;
    }

    try {
      setSaving(true);
      console.log('🔄 Eliminando categoría del Firestore...');

      // Si tiene un icono personalizado, eliminarlo también
      if (category.icon && isCustomIcon(category.icon)) {
        console.log('🖼️ Eliminando icono personalizado:', category.icon);
        try {
          await deleteCategoryIcon(category.icon);
          console.log('✅ Icono eliminado exitosamente');
        } catch (iconError) {
          console.warn('⚠️ Error eliminando icono, continuando con categoría:', iconError);
        }
      }

      await deleteCategory(category.id);
      console.log('✅ Categoría eliminada exitosamente');
      setError('');
      // La lista se actualizará automáticamente via suscripción
    } catch (error) {
      console.error('❌ Error eliminando categoría:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Funciones obsoletas eliminadas - se usa modal DOM directo

  const handleResetCategories = async () => {
    try {
      setSaving(true);
      setError('');

      const result = await resetVehicleCategories();

      if (result.success) {
        setShowResetConfirm(false);
        setError('');
        alert(`✅ ${result.message}`);
        // Los datos se actualizarán automáticamente via suscripción
      } else {
        setError('Error al resetear categorías');
      }
    } catch (error) {
      console.error('Error reseteando categorías:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const getStatsForCategory = (categoryId) => {
    return stats.find((stat) => stat.id === categoryId) || { vehicleCount: 0, activeVehicles: 0 };
  };

  if (loading) {
    const loadingContent = (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando categorías...</p>
      </div>
    );

    return embedded ? loadingContent : <div className="categories-manager">{loadingContent}</div>;
  }

  const mainContent = (
    <>
      <div className="categories-header">
        <h3>📋 Gestión de Categorías</h3>
        <div className="header-actions">
          <button
            className="btn-primary"
            onClick={() => {
              try {
                console.log('🚀 Creando nueva categoría - Modal DOM directo');

                // Crear modal completo con todos los campos
                const modalDiv = document.createElement('div');
                modalDiv.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.8);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                overflow-y: auto;
                padding: 20px;
              `;

                modalDiv.innerHTML = `
                <div style="
                  background: white; 
                  padding: 0; 
                  border-radius: 12px; 
                  width: 100%; 
                  max-width: 600px; 
                  max-height: 90vh;
                  overflow: hidden;
                  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                ">
                  <!-- Header -->
                  <div style="
                    padding: 24px 24px 16px 24px; 
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  ">
                    <h2 style="margin: 0; color: #111827; font-size: 20px; font-weight: 600;">
                      ➕ Nueva Categoría de Vehículo
                    </h2>
                    <button 
                      id="close-modal" 
                      style="
                        background: none; 
                        border: none; 
                        font-size: 24px; 
                        cursor: pointer; 
                        color: #6b7280;
                        padding: 4px;
                        border-radius: 6px;
                      "
                    >×</button>
                  </div>
                  
                  <!-- Body -->
                  <div style="padding: 24px; overflow-y: auto; max-height: calc(90vh - 140px);">
                    <form id="category-form">
                      <!-- Información Básica -->
                      <div style="margin-bottom: 24px;">
                        <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 16px; font-weight: 600;">
                          🏷️ Información Básica
                        </h3>
                        
                        <div style="margin-bottom: 16px;">
                          <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151; font-size: 14px;">
                            Nombre de la Categoría *
                          </label>
                          <input 
                            type="text" 
                            id="category-name" 
                            required 
                            style="
                              width: 100%; 
                              padding: 12px 16px; 
                              border: 2px solid #d1d5db; 
                              border-radius: 8px; 
                              font-size: 16px;
                              transition: border-color 0.2s;
                              box-sizing: border-box;
                            " 
                            placeholder="Ej: Camión Cisterna, Volqueta, Motobomba"
                          >
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                          <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151; font-size: 14px;">
                            Descripción
                          </label>
                          <textarea 
                            id="category-description" 
                            rows="3" 
                            style="
                              width: 100%; 
                              padding: 12px 16px; 
                              border: 2px solid #d1d5db; 
                              border-radius: 8px; 
                              font-size: 16px; 
                              resize: vertical;
                              transition: border-color 0.2s;
                              box-sizing: border-box;
                            " 
                            placeholder="Descripción detallada de la categoría de vehículo"
                          ></textarea>
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                          <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151; font-size: 14px;">
                            Código Único (Generado automáticamente)
                          </label>
                          <input 
                            type="text" 
                            id="category-code" 
                            readonly
                            style="
                              width: 100%; 
                              padding: 12px 16px; 
                              border: 2px solid #e5e7eb; 
                              border-radius: 8px; 
                              font-size: 16px;
                              background-color: #f9fafb;
                              box-sizing: border-box;
                              font-family: monospace;
                            " 
                            placeholder="Se generará automáticamente"
                          >
                        </div>
                      </div>
                      
                      <!-- Tipos de Combustible -->
                      <div style="margin-bottom: 24px;">
                        <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 16px; font-weight: 600;">
                          ⛽ Tipos de Combustible
                        </h3>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                          <label style="
                            display: flex; 
                            align-items: center; 
                            padding: 12px; 
                            border: 2px solid #e5e7eb; 
                            border-radius: 8px; 
                            cursor: pointer;
                            transition: all 0.2s;
                          " class="fuel-option" data-fuel="DIESEL">
                            <input type="checkbox" style="margin-right: 8px;" checked>
                            <span style="font-size: 18px; margin-right: 8px;">🛢️</span>
                            <span style="font-weight: 500;">DIESEL</span>
                          </label>
                          
                          <label style="
                            display: flex; 
                            align-items: center; 
                            padding: 12px; 
                            border: 2px solid #e5e7eb; 
                            border-radius: 8px; 
                            cursor: pointer;
                            transition: all 0.2s;
                          " class="fuel-option" data-fuel="GASOLINE">
                            <input type="checkbox" style="margin-right: 8px;">
                            <span style="font-size: 18px; margin-right: 8px;">⛽</span>
                            <span style="font-weight: 500;">GASOLINA</span>
                          </label>
                          
                          <label style="
                            display: flex; 
                            align-items: center; 
                            padding: 12px; 
                            border: 2px solid #e5e7eb; 
                            border-radius: 8px; 
                            cursor: pointer;
                            transition: all 0.2s;
                          " class="fuel-option" data-fuel="MIXTO">
                            <input type="checkbox" style="margin-right: 8px;">
                            <span style="font-size: 18px; margin-right: 8px;">🔄</span>
                            <span style="font-weight: 500;">MIXTO</span>
                          </label>
                        </div>
                      </div>
                      
                      <!-- Campos Personalizados -->
                      <div style="margin-bottom: 24px;">
                        <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 16px; font-weight: 600;">
                          📋 Campos Específicos
                        </h3>
                        
                        <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                          <label style="
                            display: flex; 
                            align-items: center; 
                            padding: 12px; 
                            border: 2px solid #e5e7eb; 
                            border-radius: 8px; 
                            cursor: pointer;
                            transition: all 0.2s;
                          " class="field-option" data-field="plateNumber">
                            <input type="checkbox" style="margin-right: 12px;" checked>
                            <span style="font-size: 16px; margin-right: 8px;">🏷️</span>
                            <div>
                              <div style="font-weight: 500;">Número de Placa</div>
                              <div style="font-size: 12px; color: #6b7280;">Identificación única del vehículo</div>
                            </div>
                          </label>
                          
                          <label style="
                            display: flex; 
                            align-items: center; 
                            padding: 12px; 
                            border: 2px solid #e5e7eb; 
                            border-radius: 8px; 
                            cursor: pointer;
                            transition: all 0.2s;
                          " class="field-option" data-field="hasHourMeter">
                            <input type="checkbox" style="margin-right: 12px;">
                            <span style="font-size: 16px; margin-right: 8px;">⏰</span>
                            <div>
                              <div style="font-weight: 500;">Verificación de Horómetro</div>
                              <div style="font-size: 12px; color: #6b7280;">Registro de horas de funcionamiento</div>
                            </div>
                          </label>
                          
                          <label style="
                            display: flex; 
                            align-items: center; 
                            padding: 12px; 
                            border: 2px solid #e5e7eb; 
                            border-radius: 8px; 
                            cursor: pointer;
                            transition: all 0.2s;
                          " class="field-option" data-field="uniqueCode">
                            <input type="checkbox" style="margin-right: 12px;" checked>
                            <span style="font-size: 16px; margin-right: 8px;">🔢</span>
                            <div>
                              <div style="font-weight: 500;">Código Único</div>
                              <div style="font-size: 12px; color: #6b7280;">Código interno de identificación</div>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      <!-- Personalización Visual -->
                      <div style="margin-bottom: 24px;">
                        <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 16px; font-weight: 600;">
                          🎨 Personalización Visual
                        </h3>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                          <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">
                              Ícono
                            </label>
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                              <button type="button" class="icon-btn" data-icon="🚗" style="
                                padding: 12px; 
                                border: 2px solid #3b82f6; 
                                background: #eff6ff;
                                border-radius: 8px; 
                                font-size: 20px; 
                                cursor: pointer;
                              ">🚗</button>
                              <button type="button" class="icon-btn" data-icon="🚛" style="
                                padding: 12px; 
                                border: 2px solid #e5e7eb; 
                                background: white;
                                border-radius: 8px; 
                                font-size: 20px; 
                                cursor: pointer;
                              ">🚛</button>
                              <button type="button" class="icon-btn" data-icon="🚜" style="
                                padding: 12px; 
                                border: 2px solid #e5e7eb; 
                                background: white;
                                border-radius: 8px; 
                                font-size: 20px; 
                                cursor: pointer;
                              ">🚜</button>
                              <button type="button" class="icon-btn" data-icon="🏗️" style="
                                padding: 12px; 
                                border: 2px solid #e5e7eb; 
                                background: white;
                                border-radius: 8px; 
                                font-size: 20px; 
                                cursor: pointer;
                              ">🏗️</button>
                              <button type="button" class="icon-btn" data-icon="🚙" style="
                                padding: 12px; 
                                border: 2px solid #e5e7eb; 
                                background: white;
                                border-radius: 8px; 
                                font-size: 20px; 
                                cursor: pointer;
                              ">🚙</button>
                              <button type="button" class="icon-btn" data-icon="🚌" style="
                                padding: 12px; 
                                border: 2px solid #e5e7eb; 
                                background: white;
                                border-radius: 8px; 
                                font-size: 20px; 
                                cursor: pointer;
                              ">🚌</button>
                              <button type="button" class="icon-btn" data-icon="🚚" style="
                                padding: 12px; 
                                border: 2px solid #e5e7eb; 
                                background: white;
                                border-radius: 8px; 
                                font-size: 20px; 
                                cursor: pointer;
                              ">🚚</button>
                              <button type="button" class="icon-btn" data-icon="🏍️" style="
                                padding: 12px; 
                                border: 2px solid #e5e7eb; 
                                background: white;
                                border-radius: 8px; 
                                font-size: 20px; 
                                cursor: pointer;
                              ">🏍️</button>
                            </div>
                          </div>
                          
                          <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">
                              Color
                            </label>
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                              <button type="button" class="color-btn" data-color="#3b82f6" style="
                                width: 40px; 
                                height: 40px; 
                                border: 3px solid #3b82f6; 
                                background: #3b82f6;
                                border-radius: 8px; 
                                cursor: pointer;
                              "></button>
                              <button type="button" class="color-btn" data-color="#10b981" style="
                                width: 40px; 
                                height: 40px; 
                                border: 2px solid #e5e7eb; 
                                background: #10b981;
                                border-radius: 8px; 
                                cursor: pointer;
                              "></button>
                              <button type="button" class="color-btn" data-color="#f59e0b" style="
                                width: 40px; 
                                height: 40px; 
                                border: 2px solid #e5e7eb; 
                                background: #f59e0b;
                                border-radius: 8px; 
                                cursor: pointer;
                              "></button>
                              <button type="button" class="color-btn" data-color="#ef4444" style="
                                width: 40px; 
                                height: 40px; 
                                border: 2px solid #e5e7eb; 
                                background: #ef4444;
                                border-radius: 8px; 
                                cursor: pointer;
                              "></button>
                              <button type="button" class="color-btn" data-color="#8b5cf6" style="
                                width: 40px; 
                                height: 40px; 
                                border: 2px solid #e5e7eb; 
                                background: #8b5cf6;
                                border-radius: 8px; 
                                cursor: pointer;
                              "></button>
                              <button type="button" class="color-btn" data-color="#06b6d4" style="
                                width: 40px; 
                                height: 40px; 
                                border: 2px solid #e5e7eb; 
                                background: #06b6d4;
                                border-radius: 8px; 
                                cursor: pointer;
                              "></button>
                              <button type="button" class="color-btn" data-color="#84cc16" style="
                                width: 40px; 
                                height: 40px; 
                                border: 2px solid #e5e7eb; 
                                background: #84cc16;
                                border-radius: 8px; 
                                cursor: pointer;
                              "></button>
                              <button type="button" class="color-btn" data-color="#f97316" style="
                                width: 40px; 
                                height: 40px; 
                                border: 2px solid #e5e7eb; 
                                background: #f97316;
                                border-radius: 8px; 
                                cursor: pointer;
                              "></button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Vista Previa -->
                      <div style="margin-bottom: 24px;">
                        <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 16px; font-weight: 600;">
                          👁️ Vista Previa
                        </h3>
                        <div id="preview-card" style="
                          border: 2px solid #3b82f6; 
                          border-radius: 12px; 
                          padding: 16px; 
                          background: #f8fafc;
                        ">
                          <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <span id="preview-icon" style="font-size: 24px; margin-right: 12px;">🚗</span>
                            <div>
                              <div id="preview-name" style="font-weight: 600; font-size: 18px; color: #111827;">Nombre de la categoría</div>
                              <div id="preview-description" style="color: #6b7280; font-size: 14px;">Descripción de la categoría</div>
                            </div>
                          </div>
                          <div style="display: flex; gap: 16px; font-size: 12px; color: #6b7280;">
                            <div><strong>Combustibles:</strong> <span id="preview-fuels">DIESEL</span></div>
                            <div><strong>Campos:</strong> <span id="preview-fields">2 seleccionados</span></div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Botones DENTRO del form para que submit funcione -->
                      <div style="
                        padding: 16px 0; 
                        border-top: 1px solid #e5e7eb;
                        display: flex; 
                        justify-content: flex-end; 
                        gap: 12px;
                        margin-top: 20px;
                      ">
                        <button 
                          type="button" 
                          id="cancel-button"
                          style="
                            padding: 12px 24px; 
                            border: 2px solid #d1d5db; 
                            border-radius: 8px; 
                            background-color: white; 
                            cursor: pointer; 
                            font-size: 16px;
                            font-weight: 500;
                            color: #374151;
                          "
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit" 
                          id="save-button"
                          style="
                            padding: 12px 24px; 
                            border: none; 
                            border-radius: 8px; 
                            background-color: #3b82f6; 
                            color: white; 
                            cursor: pointer; 
                            font-size: 16px;
                            font-weight: 500;
                          "
                        >
                          Crear Categoría
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              `;

                // Variables de estado del modal
                let selectedIcon = '🚗';
                let selectedColor = '#3b82f6';
                let selectedFuels = ['DIESEL'];
                let selectedFields = ['plateNumber', 'uniqueCode'];

                // Función para generar código único (dentro del modal)
                const generateUniqueCodeModal = (name) => {
                  if (!name) return '';
                  const baseCode = name
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, '')
                    .substring(0, 6);
                  const randomSuffix = Math.floor(Math.random() * 1000)
                    .toString()
                    .padStart(3, '0');
                  return baseCode + randomSuffix;
                };

                // Función para actualizar vista previa
                const updatePreview = () => {
                  const nameInput = modalDiv.querySelector('#category-name');
                  const descInput = modalDiv.querySelector('#category-description');
                  const codeInput = modalDiv.querySelector('#category-code');

                  const name = nameInput.value.trim() || 'Nombre de la categoría';
                  const description = descInput.value.trim() || 'Descripción de la categoría';

                  // Generar código automáticamente
                  if (nameInput.value.trim()) {
                    codeInput.value = generateUniqueCodeModal(nameInput.value);
                  }

                  // Actualizar preview
                  modalDiv.querySelector('#preview-icon').textContent = selectedIcon;
                  modalDiv.querySelector('#preview-name').textContent = name;
                  modalDiv.querySelector('#preview-description').textContent = description;
                  modalDiv.querySelector('#preview-fuels').textContent = selectedFuels.join(', ');
                  modalDiv.querySelector('#preview-fields').textContent =
                    selectedFields.length + ' seleccionados';
                  modalDiv.querySelector('#preview-card').style.borderColor = selectedColor;
                };

                // Event listeners para inputs
                modalDiv.querySelector('#category-name').addEventListener('input', updatePreview);
                modalDiv
                  .querySelector('#category-description')
                  .addEventListener('input', updatePreview);

                // Event listeners para iconos
                modalDiv.querySelectorAll('.icon-btn').forEach((btn) => {
                  btn.addEventListener('click', () => {
                    // Resetear todos los iconos
                    modalDiv.querySelectorAll('.icon-btn').forEach((b) => {
                      b.style.border = '2px solid #e5e7eb';
                      b.style.background = 'white';
                    });
                    // Activar el seleccionado
                    btn.style.border = '2px solid ' + selectedColor;
                    btn.style.background = selectedColor + '20';
                    selectedIcon = btn.dataset.icon;
                    updatePreview();
                  });
                });

                // Event listeners para colores
                modalDiv.querySelectorAll('.color-btn').forEach((btn) => {
                  btn.addEventListener('click', () => {
                    // Resetear todos los colores
                    modalDiv.querySelectorAll('.color-btn').forEach((b) => {
                      b.style.border = '2px solid #e5e7eb';
                    });
                    // Activar el seleccionado
                    btn.style.border = '3px solid ' + btn.dataset.color;
                    selectedColor = btn.dataset.color;

                    // Actualizar icono activo
                    const activeIcon = modalDiv.querySelector(
                      '.icon-btn[style*="' + selectedColor + '"]'
                    );
                    if (activeIcon) {
                      activeIcon.style.border = '2px solid ' + selectedColor;
                      activeIcon.style.background = selectedColor + '20';
                    }

                    updatePreview();
                  });
                });

                // Event listeners para combustibles
                modalDiv.querySelectorAll('.fuel-option').forEach((label) => {
                  const checkbox = label.querySelector('input[type="checkbox"]');

                  // Event listener para el label completo
                  label.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Toggle checkbox
                    checkbox.checked = !checkbox.checked;

                    const fuel = label.dataset.fuel;
                    console.log('🔄 Toggling fuel:', fuel, 'checked:', checkbox.checked);

                    if (checkbox.checked) {
                      if (!selectedFuels.includes(fuel)) {
                        selectedFuels.push(fuel);
                      }
                      label.style.border = '2px solid ' + selectedColor;
                      label.style.background = selectedColor + '20';
                    } else {
                      selectedFuels = selectedFuels.filter((f) => f !== fuel);
                      label.style.border = '2px solid #e5e7eb';
                      label.style.background = 'white';
                    }
                    updatePreview();
                  });

                  // Event listener separado para el checkbox
                  checkbox.addEventListener('click', (e) => {
                    e.stopPropagation();

                    const fuel = label.dataset.fuel;
                    console.log('🔄 Checkbox fuel:', fuel, 'checked:', checkbox.checked);

                    if (checkbox.checked) {
                      if (!selectedFuels.includes(fuel)) {
                        selectedFuels.push(fuel);
                      }
                      label.style.border = '2px solid ' + selectedColor;
                      label.style.background = selectedColor + '20';
                    } else {
                      selectedFuels = selectedFuels.filter((f) => f !== fuel);
                      label.style.border = '2px solid #e5e7eb';
                      label.style.background = 'white';
                    }
                    updatePreview();
                  });
                });

                // Event listeners para campos
                modalDiv.querySelectorAll('.field-option').forEach((label) => {
                  const checkbox = label.querySelector('input[type="checkbox"]');

                  // Event listener para el label completo
                  label.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Toggle checkbox
                    checkbox.checked = !checkbox.checked;

                    const field = label.dataset.field;
                    console.log('🔄 Toggling field:', field, 'checked:', checkbox.checked);

                    if (checkbox.checked) {
                      if (!selectedFields.includes(field)) {
                        selectedFields.push(field);
                      }
                      label.style.border = '2px solid ' + selectedColor;
                      label.style.background = selectedColor + '20';
                    } else {
                      selectedFields = selectedFields.filter((f) => f !== field);
                      label.style.border = '2px solid #e5e7eb';
                      label.style.background = 'white';
                    }
                    updatePreview();
                  });

                  // Event listener separado para el checkbox
                  checkbox.addEventListener('click', (e) => {
                    e.stopPropagation();

                    const field = label.dataset.field;
                    console.log('🔄 Checkbox field:', field, 'checked:', checkbox.checked);

                    if (checkbox.checked) {
                      if (!selectedFields.includes(field)) {
                        selectedFields.push(field);
                      }
                      label.style.border = '2px solid ' + selectedColor;
                      label.style.background = selectedColor + '20';
                    } else {
                      selectedFields = selectedFields.filter((f) => f !== field);
                      label.style.border = '2px solid #e5e7eb';
                      label.style.background = 'white';
                    }
                    updatePreview();
                  });
                });

                // Event listeners principales
                const closeBtn = modalDiv.querySelector('#close-modal');
                const cancelBtn = modalDiv.querySelector('#cancel-button');
                const form = modalDiv.querySelector('#category-form');
                const saveBtn = modalDiv.querySelector('#save-button');

                console.log('🔍 ELEMENTOS ENCONTRADOS:');
                console.log('- closeBtn:', !!closeBtn);
                console.log('- cancelBtn:', !!cancelBtn);
                console.log('- form:', !!form);
                console.log('- saveBtn:', !!saveBtn);

                const closeModal = () => modalDiv.remove();

                closeBtn.addEventListener('click', closeModal);
                cancelBtn.addEventListener('click', closeModal);

                // AGREGAR EVENT LISTENER DIRECTO AL BOTÓN PARA DEBUGGING
                saveBtn.addEventListener('click', (e) => {
                  console.log('🚨 BOTÓN SAVE CLICKEADO DIRECTAMENTE!', e);
                  console.log('🚨 Tipo de evento:', e.type);
                  console.log('🚨 Target:', e.target);
                });

                // Click outside to close
                modalDiv.addEventListener('click', (e) => {
                  if (e.target === modalDiv) closeModal();
                });

                // Form submission
                form.addEventListener('submit', async (e) => {
                  console.log('🚨 FORM SUBMIT EVENT DISPARADO!', e);
                  e.preventDefault();
                  console.log('🚨 preventDefault() ejecutado');

                  const saveButton = modalDiv.querySelector('#save-button');
                  console.log('🚨 saveButton encontrado:', !!saveButton);
                  const nameInput = modalDiv.querySelector('#category-name');
                  const descInput = modalDiv.querySelector('#category-description');
                  const codeInput = modalDiv.querySelector('#category-code');

                  const name = nameInput.value.trim();
                  const description = descInput.value.trim();
                  // Generar uniqueCode si está vacío
                  const uniqueCode = codeInput.value.trim() || generateUniqueCodeModal(name);

                  if (!name) {
                    alert('El nombre de la categoría es requerido');
                    nameInput.focus();
                    return;
                  }

                  if (selectedFuels.length === 0) {
                    alert('Debe seleccionar al menos un tipo de combustible');
                    return;
                  }

                  // Loading state
                  saveButton.disabled = true;
                  saveButton.textContent = 'Guardando...';
                  saveButton.style.backgroundColor = '#9ca3af';

                  try {
                    const categoryData = {
                      name,
                      description,
                      icon: selectedIcon,
                      color: selectedColor,
                      fuelTypes: selectedFuels,
                      fields: selectedFields,
                      uniqueCode,
                      // Remover id para que se genere automáticamente en el servicio
                      // id: generateCategoryId(name, categories),
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    };

                    console.log('💾 Creando categoría:', categoryData);
                    console.log('🔍 Validando datos antes de enviar a Firebase...');

                    // Verificación previa
                    if (!categoryData.name) {
                      throw new Error('Nombre de categoría faltante');
                    }
                    if (!categoryData.fuelTypes || categoryData.fuelTypes.length === 0) {
                      throw new Error('Tipos de combustible faltantes');
                    }

                    console.log('✅ Datos válidos, enviando a createCategory...');
                    const result = await createCategory(categoryData);
                    console.log('✅ Categoría creada exitosamente:', result);

                    // Recargar datos
                    await loadCategoriesAndStats();

                    // Notificar al padre
                    if (onCategoryCreated) {
                      onCategoryCreated(categoryData);
                    }

                    // Cerrar modal
                    closeModal();

                    // Mostrar confirmación visual exitosa con información de integración
                    const successDiv = document.createElement('div');
                    successDiv.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    padding: 20px 24px;
                    border-radius: 12px;
                    font-weight: 500;
                    box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
                    z-index: 999999;
                    animation: slideIn 0.4s ease-out;
                    max-width: 400px;
                    border-left: 4px solid #34d399;
                    cursor: pointer;
                  `;

                    successDiv.innerHTML = `
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                      <span style="font-size: 24px;">✅</span>
                      <div style="flex: 1;">
                        <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">
                          ¡Categoría creada exitosamente!
                        </div>
                        <div style="font-size: 15px; opacity: 0.95; margin-bottom: 12px;">
                          <strong>"${categoryData.name}"</strong> se agregó al sistema
                        </div>
                        <div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px; font-size: 13px;">
                          <div style="margin-bottom: 6px;"><strong>🔗 Integración automática:</strong></div>
                          <div style="margin-bottom: 4px;">• ✅ Disponible en formulario de vehículos</div>
                          <div style="margin-bottom: 4px;">• ✅ Compatible con sistema de movimientos</div>
                          <div>• ✅ Guardado en Firebase: ${result.id || 'ID generado'}</div>
                        </div>
                        <div style="font-size: 12px; opacity: 0.8; margin-top: 8px; text-align: center;">
                          Combustibles: ${categoryData.fuelTypes.join(', ')} | Campos: ${categoryData.fields.length}
                        </div>
                      </div>
                    </div>
                  `;

                    // Agregar animación CSS
                    const style = document.createElement('style');
                    style.textContent = `
                    @keyframes slideIn {
                      from { transform: translateX(100%); opacity: 0; }
                      to { transform: translateX(0); opacity: 1; }
                    }
                  `;
                    document.head.appendChild(style);

                    document.body.appendChild(successDiv);

                    // Click para cerrar manualmente
                    successDiv.addEventListener('click', () => {
                      if (successDiv.parentNode) {
                        successDiv.style.animation = 'slideIn 0.3s ease-out reverse';
                        setTimeout(() => successDiv.remove(), 300);
                      }
                      if (style.parentNode) {
                        style.remove();
                      }
                    });

                    // Auto-remove después de 8 segundos (más tiempo para leer)
                    setTimeout(() => {
                      if (successDiv.parentNode) {
                        successDiv.style.animation = 'slideIn 0.3s ease-out reverse';
                        setTimeout(() => successDiv.remove(), 300);
                      }
                      if (style.parentNode) {
                        style.remove();
                      }
                    }, 8000);
                  } catch (error) {
                    console.error('❌ Error creando categoría:', error);
                    console.error('❌ Error details:', {
                      message: error.message,
                      code: error.code,
                      stack: error.stack,
                    });

                    // Mostrar error más detallado
                    const errorMessage = error.message || 'Error desconocido';
                    alert(
                      'Error al crear la categoría: ' +
                        errorMessage +
                        '\n\nRevisa la consola para más detalles.'
                    );

                    // Restore button
                    saveButton.disabled = false;
                    saveButton.textContent = 'Crear Categoría';
                    saveButton.style.backgroundColor = '#3b82f6';
                  }
                });

                // Inicializar estado
                updatePreview();

                // Marcar elementos iniciales como seleccionados con estilos correctos
                setTimeout(() => {
                  // Marcar DIESEL como seleccionado
                  const dieselOption = modalDiv.querySelector('.fuel-option[data-fuel="DIESEL"]');
                  if (dieselOption) {
                    dieselOption.style.border = '2px solid ' + selectedColor;
                    dieselOption.style.background = selectedColor + '20';
                  }

                  // Marcar plateNumber como seleccionado
                  const plateOption = modalDiv.querySelector(
                    '.field-option[data-field="plateNumber"]'
                  );
                  if (plateOption) {
                    plateOption.style.border = '2px solid ' + selectedColor;
                    plateOption.style.background = selectedColor + '20';
                  }

                  // Marcar uniqueCode como seleccionado
                  const codeOption = modalDiv.querySelector(
                    '.field-option[data-field="uniqueCode"]'
                  );
                  if (codeOption) {
                    codeOption.style.border = '2px solid ' + selectedColor;
                    codeOption.style.background = selectedColor + '20';
                  }
                }, 100);

                // Agregar al DOM y focus
                document.body.appendChild(modalDiv);
                setTimeout(() => {
                  modalDiv.querySelector('#category-name').focus();
                }, 100);
              } catch (error) {
                console.error('❌ Error creando modal:', error);
                alert('Error al abrir el formulario de nueva categoría: ' + error.message);
              }
            }}
            disabled={saving}
            style={{
              pointerEvents: saving ? 'none' : 'auto',
              opacity: saving ? 0.6 : 1,
            }}
          >
            ➕ Nueva Categoría
          </button>

          {hasCustom && (
            <button
              className="btn-warning"
              onClick={() => setShowResetConfirm(true)}
              disabled={saving}
            >
              🗑️ Eliminar Todas
            </button>
          )}

          {!embedded && onClose && (
            <button className="btn-secondary" onClick={onClose}>
              ✕ Cerrar
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      <div className="categories-grid">
        {categories.map((category) => {
          const categoryStats = getStatsForCategory(category.id);

          return (
            <div
              key={category.id}
              className="category-card custom"
              style={{ '--category-color': category.color }}
            >
              <div className="category-header">
                <div className="category-icon" style={{ color: category.color }}>
                  {renderCategoryIcon(category.icon, {
                    className: 'category-icon-display',
                    style: { color: category.color },
                  })}
                </div>
                <div className="category-info">
                  <h4>{category.name}</h4>
                  <p>{category.description}</p>
                </div>
              </div>

              <div className="category-stats">
                <div className="stat">
                  <span className="stat-value">{categoryStats.vehicleCount}</span>
                  <span className="stat-label">Vehículos</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{categoryStats.activeVehicles}</span>
                  <span className="stat-label">Activos</span>
                </div>
              </div>

              <div className="category-details">
                <div className="fuel-types">
                  <strong>Combustibles:</strong>
                  <div className="fuel-list">
                    {(category.fuelTypes || []).map((fuel) => (
                      <span key={fuel} className="fuel-tag">
                        {fuel}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="fields">
                  <strong>Campos:</strong>
                  <div className="fields-list">
                    {(category.fields || []).slice(0, 3).map((fieldKey) => {
                      const field = AVAILABLE_FIELDS.find((f) => f.key === fieldKey);
                      return field ? (
                        <span key={fieldKey} className="field-tag">
                          {field.icon} {field.label}
                        </span>
                      ) : null;
                    })}
                    {(category.fields || []).length > 3 && (
                      <span className="more-fields">+{(category.fields || []).length - 3} más</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="category-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEditCategory(category)}
                  disabled={saving}
                  title="Editar categoría"
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteCategory(category)}
                  disabled={saving || categoryStats.vehicleCount > 0}
                  title={
                    categoryStats.vehicleCount > 0
                      ? 'No se puede eliminar una categoría con vehículos asignados'
                      : 'Eliminar categoría'
                  }
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  return embedded ? (
    <>
      {mainContent}

      {/* Modal de confirmación para reset */}
      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🗑️ Confirmar Eliminación</h3>
              <button onClick={() => setShowResetConfirm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>
                <strong>¿Estás seguro de que deseas eliminar todas las categorías?</strong>
              </p>
              <p>Esta acción eliminará todas las categorías de vehículos de la aplicación.</p>
              <p className="warning">⚠️ Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowResetConfirm(false)}
                disabled={saving}
              >
                Cancelar
              </button>
              <button className="btn-danger" onClick={handleResetCategories} disabled={saving}>
                {saving ? 'Eliminando...' : 'Eliminar Todas'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <div className="categories-manager">
      {mainContent}

      {/* Modal de confirmación para reset */}
      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🗑️ Confirmar Eliminación</h3>
              <button onClick={() => setShowResetConfirm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>
                <strong>¿Estás seguro de que deseas eliminar todas las categorías?</strong>
              </p>
              <p>Esta acción eliminará todas las categorías de vehículos de la aplicación.</p>
              <p className="warning">⚠️ Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowResetConfirm(false)}
                disabled={saving}
              >
                Cancelar
              </button>
              <button className="btn-danger" onClick={handleResetCategories} disabled={saving}>
                {saving ? 'Eliminando...' : 'Eliminar Todas'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debug del modal - AMPLIADO PARA DIAGNÓSTICO */}
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.9)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          fontSize: '14px',
          zIndex: 99999,
          fontFamily: 'monospace',
          minWidth: '200px',
        }}
      >
        <div>
          🎯 <strong>DEBUG MODAL</strong>
        </div>
        <div>
          showCategoryModal:{' '}
          <strong style={{ color: showCategoryModal ? '#00ff00' : '#ff0000' }}>
            {String(showCategoryModal)}
          </strong>
        </div>
        <div>
          editingCategory: <strong>{editingCategory ? 'SÍ' : 'NO'}</strong>
        </div>
        <div>
          saving: <strong>{saving ? 'SÍ' : 'NO'}</strong>
        </div>
        <div>
          Re-render: <strong>{Date.now() % 10000}</strong>
        </div>
      </div>

      {/* DIAGNÓSTICO COMPLETO DEL RENDER */}
      {console.log('🔍 RENDER - showCategoryModal:', showCategoryModal, 'timestamp:', Date.now())}
      {console.log('🚀 Punto de renderizado modal - showCategoryModal:', showCategoryModal)}

      {/* TEST: Modal directo con React (debería funcionar si el render funciona) */}
      {showCategoryModal && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            zIndex: 999999,
            border: '3px solid green',
          }}
        >
          <h2>🧪 TEST MODAL REACT</h2>
          <p>Si ves esto, el estado funciona correctamente</p>
          <button onClick={() => setShowCategoryModal(false)}>Cerrar</button>
        </div>
      )}

      <HybridCategoryModal
        isOpen={showCategoryModal}
        onClose={() => {
          console.log('� HybridModal onClose llamado');
          setShowCategoryModal(false);
        }}
        onSave={async (categoryData) => {
          console.log('💾 HybridModal onSave llamado con:', categoryData);

          try {
            await createCategory(categoryData);
            console.log('✅ Categoría creada exitosamente');

            // Recargar datos
            await loadCategoriesAndStats();

            // Notificar al padre si existe
            if (onCategoryCreated) {
              onCategoryCreated(categoryData);
            }

            return Promise.resolve();
          } catch (error) {
            console.error('❌ Error creando categoría:', error);
            throw error;
          }
        }}
        category={editingCategory}
      />

      {/* Test visual directo con renderizado condicional */}
      {showCategoryModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 0, 0, 0.9)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          🚨 SI VES ESTO, EL ESTADO FUNCIONA 🚨
          <button
            onClick={() => setShowCategoryModal(false)}
            style={{
              marginLeft: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: 'white',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Modal original (comentado temporalmente para debugging)
      <VehicleCategoryModal
        isOpen={Boolean(showCategoryModal)} // Forzar boolean explícito
        onClose={() => {
          console.log('🚪 Modal onClose llamado');
          handleCategoryModalClose();
        }}
        category={editingCategory}
        onSuccess={() => {
          console.log('✅ Modal onSuccess llamado');
          handleCategoryModalSuccess();
        }}
      />
      */}
    </div>
  );
};

export default VehicleCategoriesManager;
