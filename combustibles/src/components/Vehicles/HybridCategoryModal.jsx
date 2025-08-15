/**
 * HybridCategoryModal - Modal híbrido que siempre funciona
 * Combina React Portal con DOM directo como respaldo
 */

import React, { useEffect, useCallback } from 'react';

const HybridCategoryModal = ({ isOpen, onClose, onSave, category = null }) => {
  const createDirectModal = useCallback(() => {
    // Limpiar modales existentes
    const existingModal = document.getElementById('hybrid-category-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Crear modal directamente en DOM
    const modalDiv = document.createElement('div');
    modalDiv.id = 'hybrid-category-modal';
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
    `;

    modalDiv.innerHTML = `
      <div style="
        background: white; 
        padding: 0; 
        border-radius: 12px; 
        width: 90%; 
        max-width: 500px; 
        max-height: 90vh; 
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      ">
        <!-- Header -->
        <div style="
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 24px 24px 16px 24px; 
          border-bottom: 1px solid #e5e7eb;
        ">
          <h2 style="margin: 0; color: #111827; font-size: 20px; font-weight: 600;">
            ${category ? 'Editar Categoría' : 'Nueva Categoría de Vehículo'}
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
            onmouseover="this.style.backgroundColor='#f3f4f6'"
            onmouseout="this.style.backgroundColor='transparent'"
          >×</button>
        </div>
        
        <!-- Body -->
        <div style="padding: 24px; overflow-y: auto; max-height: calc(90vh - 140px);">
          <div id="error-message" style="display: none; background-color: #fef2f2; color: #dc2626; padding: 12px; border-radius: 6px; margin-bottom: 16px; border: 1px solid #fecaca;"></div>
          
          <form id="category-form">
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #374151; font-size: 14px;">
                Nombre de la Categoría *
              </label>
              <input 
                type="text" 
                id="category-name" 
                required 
                value="${category?.name || ''}"
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
                onfocus="this.style.borderColor='#3b82f6'"
                onblur="this.style.borderColor='#d1d5db'"
              >
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #374151; font-size: 14px;">
                Descripción
              </label>
              <textarea 
                id="category-description" 
                rows="3" 
                value="${category?.description || ''}"
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
                placeholder="Descripción detallada de la categoría"
                onfocus="this.style.borderColor='#3b82f6'"
                onblur="this.style.borderColor='#d1d5db'"
              >${category?.description || ''}</textarea>
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #374151; font-size: 14px;">
                Capacidad de Combustible (Litros)
              </label>
              <input 
                type="number" 
                id="category-capacity" 
                min="0" 
                step="0.01"
                value="${category?.capacity || ''}"
                style="
                  width: 100%; 
                  padding: 12px 16px; 
                  border: 2px solid #d1d5db; 
                  border-radius: 8px; 
                  font-size: 16px;
                  transition: border-color 0.2s;
                  box-sizing: border-box;
                " 
                placeholder="Ej: 1000, 500, 2000"
                onfocus="this.style.borderColor='#3b82f6'"
                onblur="this.style.borderColor='#d1d5db'"
              >
            </div>
            
            <div style="margin-bottom: 24px;">
              <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #374151; font-size: 14px;">
                Tipo de Combustible Principal
              </label>
              <select 
                id="category-fuelType" 
                style="
                  width: 100%; 
                  padding: 12px 16px; 
                  border: 2px solid #d1d5db; 
                  border-radius: 8px; 
                  font-size: 16px;
                  transition: border-color 0.2s;
                  box-sizing: border-box;
                  background-color: white;
                "
                onfocus="this.style.borderColor='#3b82f6'"
                onblur="this.style.borderColor='#d1d5db'"
              >
                <option value="ACPM" ${category?.fuelType === 'ACPM' ? 'selected' : ''}>ACPM (Diésel)</option>
                <option value="GASOLINA_CORRIENTE" ${category?.fuelType === 'GASOLINA_CORRIENTE' ? 'selected' : ''}>Gasolina Corriente</option>
                <option value="GASOLINA_EXTRA" ${category?.fuelType === 'GASOLINA_EXTRA' ? 'selected' : ''}>Gasolina Extra</option>
                <option value="JET_A1" ${category?.fuelType === 'JET_A1' ? 'selected' : ''}>Jet A1</option>
              </select>
            </div>
            
            <!-- Buttons -->
            <div style="display: flex; justify-content: flex-end; gap: 12px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
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
                  transition: all 0.2s;
                "
                onmouseover="this.style.backgroundColor='#f9fafb'; this.style.borderColor='#9ca3af'"
                onmouseout="this.style.backgroundColor='white'; this.style.borderColor='#d1d5db'"
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
                  transition: background-color 0.2s;
                "
                onmouseover="this.style.backgroundColor='#2563eb'"
                onmouseout="this.style.backgroundColor='#3b82f6'"
              >
                ${category ? 'Actualizar' : 'Crear'} Categoría
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Event listeners
    const closeButton = modalDiv.querySelector('#close-modal');
    const cancelButton = modalDiv.querySelector('#cancel-button');
    const form = modalDiv.querySelector('#category-form');
    const errorDiv = modalDiv.querySelector('#error-message');

    const closeModal = () => {
      modalDiv.remove();
      if (onClose) onClose();
    };

    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);

    // Click outside to close
    modalDiv.addEventListener('click', (e) => {
      if (e.target === modalDiv) {
        closeModal();
      }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const saveButton = modalDiv.querySelector('#save-button');
      const nameInput = modalDiv.querySelector('#category-name');
      const descriptionInput = modalDiv.querySelector('#category-description');
      const capacityInput = modalDiv.querySelector('#category-capacity');
      const fuelTypeInput = modalDiv.querySelector('#category-fuelType');

      const formData = {
        name: nameInput.value.trim(),
        description: descriptionInput.value.trim(),
        capacity: capacityInput.value ? parseFloat(capacityInput.value) : null,
        fuelType: fuelTypeInput.value,
      };

      if (!formData.name) {
        errorDiv.textContent = 'El nombre de la categoría es requerido';
        errorDiv.style.display = 'block';
        nameInput.focus();
        return;
      }

      // Loading state
      saveButton.disabled = true;
      saveButton.textContent = 'Guardando...';
      saveButton.style.backgroundColor = '#9ca3af';
      errorDiv.style.display = 'none';

      try {
        console.log('💾 Guardando categoría:', formData);
        await onSave(formData);
        console.log('✅ Categoría guardada exitosamente');
        modalDiv.remove();
        if (onClose) onClose();
      } catch (error) {
        console.error('❌ Error al guardar categoría:', error);
        errorDiv.textContent = `Error al guardar: ${error.message || 'Error desconocido'}`;
        errorDiv.style.display = 'block';

        // Restore button
        saveButton.disabled = false;
        saveButton.textContent = category ? 'Actualizar Categoría' : 'Crear Categoría';
        saveButton.style.backgroundColor = '#3b82f6';
      }
    });

    // Agregar al DOM
    document.body.appendChild(modalDiv);

    // Focus en el primer input
    setTimeout(() => {
      const nameInput = modalDiv.querySelector('#category-name');
      if (nameInput) nameInput.focus();
    }, 100);
  }, [onClose, onSave, category]);

  useEffect(() => {
    console.log('🎯 HybridCategoryModal - useEffect EJECUTADO:', { isOpen, timestamp: Date.now() });

    if (isOpen) {
      console.log('🚀 MODAL ABIERTO - Creando modal DOM directo inmediatamente');

      // Test inmediato con alert
      console.log('🔥 ALERTA DE PRUEBA - El modal debería abrirse');

      createDirectModal();
    } else {
      console.log('❌ isOpen es false, no creando modal');
    }
  }, [isOpen, createDirectModal]);

  // No renderizar nada en React - todo se maneja por DOM directo
  return null;
};

export default HybridCategoryModal;
