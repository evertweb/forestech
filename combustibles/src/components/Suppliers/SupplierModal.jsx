// combustibles/src/components/Suppliers/SupplierModal.jsx
// Modal para crear/editar proveedores
import React, { useState, useEffect, useCallback } from 'react';
import useFormData from '../../hooks/useFormData';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { createSupplier, updateSupplier } from '../../services/suppliersService';
import { FUEL_TYPES } from '../../constants/combustibleTypes';
import { MODAL_PRESETS, UI_ACTIONS, UI_FORM_LABELS, UI_MESSAGES, UI_TITLES, UI_STATUS, UI_PLACEHOLDERS } from '../../constants';

const SupplierModal = ({ supplier, onClose, onSuccess, onError }) => {
  const { userProfile } = useCombustibles();
  const isEditing = !!supplier;


  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'contact', 'products', 'commercial'

  // Estado inicial y validación con useFormData
  const getInitialFormData = useCallback(() => ({
    name: '',
    taxId: '',
    type: 'proveedor',
    category: 'combustibles',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Colombia',
    fuelTypes: [],
    paymentTerms: 'contado',
    creditLimit: '',
    priceList: {},
    rating: 5,
    evaluationNotes: '',
    status: 'active',
    isPreferred: false
  }), []);

  const validate = (values) => {
    const newErrors = {};
    if (!values.name.trim()) {
      newErrors.name = `${UI_FORM_LABELS.SUPPLIER} ${UI_FORM_LABELS.NAME} es requerido`;
    }
    if (!values.category) {
      newErrors.category = `${UI_FORM_LABELS.CATEGORY} es requerida`;
    }
    if (!values.type) {
      newErrors.type = `El ${UI_FORM_LABELS.TYPE} de ${UI_FORM_LABELS.SUPPLIER.toLowerCase()} es requerido`;
    }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = `El formato del ${UI_FORM_LABELS.EMAIL.toLowerCase()} no es válido`;
    }
    if (values.phone && !/^[\d\s\-+()]+$/.test(values.phone)) {
      newErrors.phone = `El formato del ${UI_FORM_LABELS.PHONE.toLowerCase()} no es válido`;
    }
    if (values.creditLimit && (isNaN(values.creditLimit) || parseFloat(values.creditLimit) < 0)) {
      newErrors.creditLimit = 'El límite de crédito debe ser un número positivo';
    }
    if (values.rating < 1 || values.rating > 5) {
      newErrors.rating = 'El rating debe estar entre 1 y 5';
    }
    (values.fuelTypes || []).forEach(fuelType => {
      if (values.priceList && values.priceList[fuelType] && (isNaN(values.priceList[fuelType]) || parseFloat(values.priceList[fuelType]) < 0)) {
        newErrors[`price_${fuelType}`] = `El precio de ${FUEL_TYPES[fuelType]} debe ser un número positivo`;
      }
    });
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const {
    values: formData,
    setValues: setFormData,
    errors,
    handleInputChange,
    resetForm,
    validateForm
  } = useFormData(getInitialFormData(), validate);

  // Inicializar datos al editar
  useEffect(() => {
    if (isEditing && supplier) {
      setFormData({
        name: supplier.name || '',
        taxId: supplier.taxId || '',
        type: supplier.type || 'proveedor',
        category: supplier.category || 'combustibles',
        contactPerson: supplier.contactPerson || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
        city: supplier.city || '',
        state: supplier.state || 'Colombia',
        fuelTypes: supplier.fuelTypes || [],
        paymentTerms: supplier.paymentTerms || 'contado',
        creditLimit: supplier.creditLimit || '',
        priceList: supplier.priceList || {},
        rating: supplier.rating || 5,
        evaluationNotes: supplier.evaluationNotes || '',
        status: supplier.status || 'active',
        isPreferred: supplier.isPreferred || false
      });
    } else if (!isEditing) {
      resetForm();
    }
  }, [isEditing, supplier, setFormData, resetForm]);



  const handleFuelTypeToggle = (fuelType) => {
    setFormData(prev => ({
      ...prev,
      fuelTypes: prev.fuelTypes.includes(fuelType)
        ? prev.fuelTypes.filter(ft => ft !== fuelType)
        : [...prev.fuelTypes, fuelType]
    }));
  };

  const handlePriceChange = (fuelType, price) => {
    setFormData(prev => ({
      ...prev,
      priceList: {
        ...prev.priceList,
        [fuelType]: parseFloat(price) || 0
      }
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const supplierData = {
        ...formData,
        creditLimit: parseFloat(formData.creditLimit) || 0,
        rating: parseFloat(formData.rating) || 5,
        priceList: Object.fromEntries(
          Object.entries(formData.priceList).filter(([fuelType, price]) => 
            formData.fuelTypes.includes(fuelType) && price > 0
          )
        )
      };
      let result;
      if (isEditing) {
        result = await updateSupplier(supplier.id, supplierData, userProfile?.email);
      } else {
        result = await createSupplier(supplierData, userProfile?.email);
      }
      if (result.success) {
        onSuccess();
      } else {
        onError(result.error || `${UI_MESSAGES.ERROR.SAVE_FAILED} ${UI_FORM_LABELS.SUPPLIER.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Error saving supplier:', error);
      onError(`Error inesperado al ${UI_ACTIONS.SAVE.toLowerCase()} ${UI_FORM_LABELS.SUPPLIER.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Información Básica', icon: 'icon-info' },
    { id: 'contact', label: UI_FORM_LABELS.CONTACT, icon: 'icon-phone' },
    { id: 'products', label: UI_TITLES.PRODUCTS, icon: 'icon-package' },
    { id: 'commercial', label: 'Comercial', icon: 'icon-credit-card' }
  ];

  return (
    <div className={MODAL_PRESETS.INVENTORY_MODAL.overlay} onClick={onClose}>
      <div className={`${MODAL_PRESETS.INVENTORY_MODAL.content} large`} onClick={e => e.stopPropagation()}>
        <div className={MODAL_PRESETS.INVENTORY_MODAL.header}>
          <h2>
            <i className="icon-truck"></i>
            {isEditing ? `${UI_ACTIONS.EDIT} ${UI_FORM_LABELS.SUPPLIER}` : `Nuevo ${UI_FORM_LABELS.SUPPLIER}`}
          </h2>
          <button className={MODAL_PRESETS.INVENTORY_MODAL.close} onClick={onClose}>
            <i className="icon-x"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tabs */}
          <div className="modal-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="modal-body">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="tab-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="required">{UI_FORM_LABELS.NAME} del {UI_FORM_LABELS.SUPPLIER}</label>
                    <input
                      type="text"
                      value={formData.name}
                      name="name"
                      onChange={handleInputChange}
                      placeholder={`Ingresa el ${UI_FORM_LABELS.NAME.toLowerCase()} del ${UI_FORM_LABELS.SUPPLIER.toLowerCase()}`}
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label>NIT / Documento</label>
                    <input
                      type="text"
                      value={formData.taxId}
                      name="taxId"
                      onChange={handleInputChange}
                      placeholder="123456789-0"
                      className={errors.taxId ? 'error' : ''}
                    />
                    {errors.taxId && <span className="error-message">{errors.taxId}</span>}
                  </div>

                  <div className="form-group">
                    <label className="required">{UI_FORM_LABELS.TYPE} de {UI_FORM_LABELS.SUPPLIER}</label>
                    <select
                      value={formData.type}
                      name="type"
                      onChange={handleInputChange}
                      className={errors.type ? 'error' : ''}
                    >
                      <option value="proveedor">{UI_FORM_LABELS.SUPPLIER}</option>
                      <option value="distribuidor">Distribuidor</option>
                      <option value="mayorista">Mayorista</option>
                    </select>
                    {errors.type && <span className="error-message">{errors.type}</span>}
                  </div>

                  <div className="form-group">
                    <label className="required">{UI_FORM_LABELS.CATEGORY}</label>
                    <select
                      value={formData.category}
                      name="category"
                      onChange={handleInputChange}
                      className={errors.category ? 'error' : ''}
                    >
                      <option value="combustibles">Combustibles</option>
                      <option value="lubricantes">Lubricantes</option>
                      <option value="aditivos">Aditivos</option>
                    </select>
                    {errors.category && <span className="error-message">{errors.category}</span>}
                  </div>

                  <div className="form-group">
                    <label>{UI_FORM_LABELS.STATUS}</label>
                    <select
                      value={formData.status}
                      name="status"
                      onChange={handleInputChange}
                    >
                      <option value="active">{UI_STATUS.ACTIVE}</option>
                      <option value="inactive">{UI_STATUS.INACTIVE}</option>
                      <option value="suspended">Suspendido</option>
                    </select>
                  </div>

                  <div className="form-group checkbox">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isPreferred"
                        checked={formData.isPreferred}
                        onChange={handleInputChange}
                      />
                      <span className="checkbox-mark"></span>
                      {UI_STATUS.PREFERRED_SUPPLIER}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information Tab */}
            {activeTab === 'contact' && (
              <div className="tab-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Persona de {UI_FORM_LABELS.CONTACT}</label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      name="contactPerson"
                      onChange={handleInputChange}
                      placeholder="Nombre del contacto principal"
                    />
                  </div>

                  <div className="form-group">
                    <label>{UI_FORM_LABELS.PHONE}</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      name="phone"
                      onChange={handleInputChange}
                      placeholder={UI_PLACEHOLDERS.PHONE_FORMAT}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label>{UI_FORM_LABELS.EMAIL}</label>
                    <input
                      type="email"
                      value={formData.email}
                      name="email"
                      onChange={handleInputChange}
                      placeholder={UI_PLACEHOLDERS.EMAIL_FORMAT}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Ciudad</label>
                    <input
                      type="text"
                      value={formData.city}
                      name="city"
                      onChange={handleInputChange}
                      placeholder="Bogotá"
                    />
                  </div>

                  <div className="form-group">
                    <label>Estado/País</label>
                    <input
                      type="text"
                      value={formData.state}
                      name="state"
                      onChange={handleInputChange}
                      placeholder="Colombia"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>{UI_FORM_LABELS.ADDRESS}</label>
                    <textarea
                      value={formData.address}
                      name="address"
                      onChange={handleInputChange}
                      placeholder={`${UI_FORM_LABELS.ADDRESS} completa del ${UI_FORM_LABELS.SUPPLIER.toLowerCase()}`}
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="tab-content">
                <div className="section">
                  <h3>Tipos de Combustible que Suministra</h3>
                  <div className="fuel-types-grid">
                    {Object.entries(FUEL_TYPES).map(([key, label]) => (
                      <div key={key} className="fuel-type-item">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.fuelTypes.includes(key)}
                            onChange={() => handleFuelTypeToggle(key)}
                          />
                          <span className="checkbox-mark"></span>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.fuelTypes.length > 0 && (
                  <div className="section">
                    <h3>Precios por Litro (Opcional)</h3>
                    <div className="prices-grid">
                      {formData.fuelTypes.map(fuelType => (
                        <div key={fuelType} className="form-group">
                          <label>{FUEL_TYPES[fuelType]}</label>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={formData.priceList[fuelType] || ''}
                              onChange={(e) => handlePriceChange(fuelType, e.target.value)}
                              placeholder="0.00"
                              className={errors[`price_${fuelType}`] ? 'error' : ''}
                            />
                          </div>
                          {errors[`price_${fuelType}`] && (
                            <span className="error-message">{errors[`price_${fuelType}`]}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Commercial Tab */}
            {activeTab === 'commercial' && (
              <div className="tab-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Términos de Pago</label>
                    <select
                      value={formData.paymentTerms}
                      name="paymentTerms"
                      onChange={handleInputChange}
                    >
                      <option value="contado">Contado</option>
                      <option value="30dias">30 días</option>
                      <option value="60dias">60 días</option>
                      <option value="90dias">90 días</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Límite de Crédito</label>
                    <div className="input-with-currency">
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="creditLimit"
                        value={formData.creditLimit}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className={errors.creditLimit ? 'error' : ''}
                      />
                    </div>
                    {errors.creditLimit && <span className="error-message">{errors.creditLimit}</span>}
                  </div>

                  <div className="form-group">
                    <label>Rating</label>
                    <div className="rating-input">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.1"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        className={errors.rating ? 'error' : ''}
                      />
                      <div className="rating-display">
                        <span className="rating-value">{formData.rating.toFixed(1)}</span>
                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span 
                              key={star} 
                              className={`star ${star <= Math.round(formData.rating) ? 'filled' : ''}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {errors.rating && <span className="error-message">{errors.rating}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label>Notas de Evaluación</label>
                    <textarea
                      name="evaluationNotes"
                      value={formData.evaluationNotes}
                      onChange={handleInputChange}
                      placeholder="Comentarios sobre el desempeño del proveedor..."
                      rows="4"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              {UI_ACTIONS.CANCEL}
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner small"></div>
                  {isEditing ? UI_MESSAGES.LOADING.UPDATING : UI_MESSAGES.LOADING.CREATING}
                </>
              ) : (
                <>
                  <i className="icon-save"></i>
                  {isEditing ? `${UI_ACTIONS.UPDATE} ${UI_FORM_LABELS.SUPPLIER}` : `${UI_ACTIONS.CREATE} ${UI_FORM_LABELS.SUPPLIER}`}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierModal;