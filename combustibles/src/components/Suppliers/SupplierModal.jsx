/**
 * SupplierModal - Modal para crear/editar proveedores
 * Refactorizado para usar BaseModal
 */
import React, { useState, useEffect, useCallback } from 'react';
import BaseModal from '../shared/BaseModal';
import ModalHeader from '../shared/ModalHeader';
import ModalFooter from '../shared/ModalFooter';
import useFormData from '../../hooks/useFormData';
import {
  validationSchemas,
  validators,
  validateForm as runValidation,
} from '../../utils/validators';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { createSupplier, updateSupplier } from '../../services/FirebaseSuppliersService';
import { useFirebaseProgressContext } from '../../contexts/FirebaseProgressContext';
import { FUEL_TYPES } from '../../constants/combustibleTypes';
import {
  MODAL_PRESETS,
  UI_ACTIONS,
  UI_FORM_LABELS,
  UI_MESSAGES,
  UI_TITLES,
  UI_STATUS,
  UI_PLACEHOLDERS,
} from '../../constants';

const SupplierModal = ({ supplier, onClose, onSuccess, onError }) => {
  const { userProfile } = useCombustibles();
  const isEditing = !!supplier;

  // Hook para progreso transparente de Firebase
  const { executeWithProgress } = useFirebaseProgressContext();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'contact', 'products', 'commercial'

  // Estado inicial y validación con useFormData
  const getInitialFormData = useCallback(
    () => ({
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
      isPreferred: false,
    }),
    []
  );

  // Validación centralizada: schema + reglas extra dinámicas (priceList por fuelType)
  const validate = (values) => {
    // Ejecutar schema base de suppliers
    const base = validationSchemas.supplier
      ? runValidation(values, validationSchemas.supplier)
      : { isValid: true, errors: {} };

    // Reglas adicionales: category y type requeridos
    const extraErrors = { ...base.errors };
    if (!values.category) extraErrors.category = `${UI_FORM_LABELS.CATEGORY} es requerida`;
    if (!values.type)
      extraErrors.type = `El ${UI_FORM_LABELS.TYPE} de ${UI_FORM_LABELS.SUPPLIER.toLowerCase()} es requerido`;

    // Validar priceList por cada fuelType marcado
    (values.fuelTypes || []).forEach((fuelType) => {
      const price = values.priceList?.[fuelType];
      const err = validators.nonNegative(
        price,
        `El precio de ${FUEL_TYPES[fuelType]} debe ser un número positivo`
      );
      if (err) extraErrors[`price_${fuelType}`] = err;
    });

    return { isValid: Object.keys(extraErrors).length === 0, errors: extraErrors };
  };

  const {
    values: formData,
    setValues: setFormData,
    errors,
    handleInputChange,
    resetForm,
    validateForm,
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
        isPreferred: supplier.isPreferred || false,
      });
    } else if (!isEditing) {
      resetForm();
    }
  }, [isEditing, supplier, setFormData, resetForm]);

  const handleFuelTypeToggle = (fuelType) => {
    setFormData((prev) => ({
      ...prev,
      fuelTypes: prev.fuelTypes.includes(fuelType)
        ? prev.fuelTypes.filter((ft) => ft !== fuelType)
        : [...prev.fuelTypes, fuelType],
    }));
  };

  const handlePriceChange = (fuelType, price) => {
    setFormData((prev) => ({
      ...prev,
      priceList: {
        ...prev.priceList,
        [fuelType]: parseFloat(price) || 0,
      },
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
          Object.entries(formData.priceList).filter(
            ([fuelType, price]) => formData.fuelTypes.includes(fuelType) && price > 0
          )
        ),
      };

      // Generar descripción para el progreso
      const progressDescription = isEditing
        ? `Actualizando proveedor ${formData.name}`
        : `Creando proveedor ${formData.name}`;

      const operationType = isEditing ? 'updateSupplier' : 'createSupplier';

      // Ejecutar con progreso transparente
      const result = await executeWithProgress(
        operationType,
        progressDescription,
        () =>
          isEditing
            ? updateSupplier(supplier.id, supplierData, userProfile?.email)
            : createSupplier(supplierData, userProfile?.email),
        {
          supplierName: formData.name,
          isUpdate: isEditing,
        }
      );

      if (result.success) {
        onSuccess();
      } else {
        onError(
          result.error ||
            `${UI_MESSAGES.ERROR.SAVE_FAILED} ${UI_FORM_LABELS.SUPPLIER.toLowerCase()}`
        );
      }
    } catch (error) {
      console.error('Error saving supplier:', error);
      onError(
        `Error inesperado al ${UI_ACTIONS.SAVE.toLowerCase()} ${UI_FORM_LABELS.SUPPLIER.toLowerCase()}`
      );
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Información Básica', icon: 'icon-info' },
    { id: 'contact', label: UI_FORM_LABELS.CONTACT, icon: 'icon-phone' },
    { id: 'products', label: UI_TITLES.PRODUCTS, icon: 'icon-package' },
    { id: 'commercial', label: 'Comercial', icon: 'icon-credit-card' },
  ];

  const getModalTitle = () => {
    return isEditing
      ? `${UI_ACTIONS.EDIT} ${UI_FORM_LABELS.SUPPLIER}`
      : `Nuevo ${UI_FORM_LABELS.SUPPLIER}`;
  };

  return (
    <BaseModal isOpen={true} onClose={onClose} size="lg" className="apple-modal">
      <ModalHeader title={getModalTitle()} icon="🚚" onClose={onClose} />

      <div className="apple-modal-content">
        <form onSubmit={handleSubmit}>
          {/* Tabs */}
          <div className="apple-nav-container modal-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`apple-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="apple-form-content">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="apple-form-section">
                <div className="apple-form-row">
                  <div className="apple-form-group">
                    <label className="apple-form-label required">
                      {UI_FORM_LABELS.NAME} del {UI_FORM_LABELS.SUPPLIER}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      name="name"
                      onChange={handleInputChange}
                      placeholder={`Ingresa el ${UI_FORM_LABELS.NAME.toLowerCase()} del ${UI_FORM_LABELS.SUPPLIER.toLowerCase()}`}
                      className={`apple-form-input ${errors.name ? 'error' : ''}`}
                    />
                    {errors.name && <div className="apple-form-error">{errors.name}</div>}
                  </div>

                  <div className="apple-form-group">
                    <label className="apple-form-label">NIT / Documento</label>
                    <input
                      type="text"
                      value={formData.taxId}
                      name="taxId"
                      onChange={handleInputChange}
                      placeholder="123456789-0"
                      className={`apple-form-input ${errors.taxId ? 'error' : ''}`}
                    />
                    {errors.taxId && (
                      <div className="apple-form-error">{errors.taxId}</div>
                    )}
                  </div>

                  <div className="apple-form-group">
                    <label className="apple-form-label required">
                      {UI_FORM_LABELS.TYPE} de {UI_FORM_LABELS.SUPPLIER}
                    </label>
                    <select
                      value={formData.type}
                      name="type"
                      onChange={handleInputChange}
                      className={`apple-form-select ${errors.type ? 'error' : ''}`}
                    >
                      <option value="proveedor">{UI_FORM_LABELS.SUPPLIER}</option>
                      <option value="distribuidor">Distribuidor</option>
                      <option value="mayorista">Mayorista</option>
                    </select>
                    {errors.type && <div className="apple-form-error">{errors.type}</div>}
                  </div>

                  <div className="apple-form-group">
                    <label className="apple-form-label required">{UI_FORM_LABELS.CATEGORY}</label>
                    <select
                      value={formData.category}
                      name="category"
                      onChange={handleInputChange}
                      className={`apple-form-select ${errors.category ? 'error' : ''}`}
                    >
                      <option value="combustibles">Combustibles</option>
                      <option value="lubricantes">Lubricantes</option>
                      <option value="aditivos">Aditivos</option>
                    </select>
                    {errors.category && (
                      <div className="apple-form-error">{errors.category}</div>
                    )}
                  </div>

                  <div className="apple-form-group">
                    <label className="apple-form-label">{UI_FORM_LABELS.STATUS}</label>
                    <select
                      value={formData.status}
                      name="status"
                      onChange={handleInputChange}
                      className="apple-form-select"
                    >
                      <option value="active">{UI_STATUS.ACTIVE}</option>
                      <option value="inactive">{UI_STATUS.INACTIVE}</option>
                      <option value="suspended">Suspendido</option>
                    </select>
                  </div>

                  <div className="apple-form-group">
                    <div className="apple-form-checkbox">
                      <input
                        type="checkbox"
                        name="isPreferred"
                        checked={formData.isPreferred}
                        onChange={handleInputChange}
                      />
                      <label className="apple-form-checkbox-label">
                        {UI_STATUS.PREFERRED_SUPPLIER}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information Tab */}
            {activeTab === 'contact' && (
              <div className="apple-form-section">
                <div className="apple-form-row">
                  <div className="apple-form-group">
                    <label className="apple-form-label">Persona de {UI_FORM_LABELS.CONTACT}</label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      name="contactPerson"
                      onChange={handleInputChange}
                      placeholder="Nombre del contacto principal"
                      className="apple-form-input"
                    />
                  </div>

                  <div className="apple-form-group">
                    <label className="apple-form-label">{UI_FORM_LABELS.PHONE}</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      name="phone"
                      onChange={handleInputChange}
                      placeholder={UI_PLACEHOLDERS.PHONE_FORMAT}
                      className={`apple-form-input ${errors.phone ? 'error' : ''}`}
                    />
                    {errors.phone && (
                      <div className="apple-form-error">{errors.phone}</div>
                    )}
                  </div>

                  <div className="apple-form-group">
                    <label className="apple-form-label">{UI_FORM_LABELS.EMAIL}</label>
                    <input
                      type="email"
                      value={formData.email}
                      name="email"
                      onChange={handleInputChange}
                      placeholder={UI_PLACEHOLDERS.EMAIL_FORMAT}
                      className={`apple-form-input ${errors.email ? 'error' : ''}`}
                    />
                    {errors.email && (
                      <div className="apple-form-error">{errors.email}</div>
                    )}
                  </div>

                  <div className="apple-form-group">
                    <label className="apple-form-label">Ciudad</label>
                    <input
                      type="text"
                      value={formData.city}
                      name="city"
                      onChange={handleInputChange}
                      placeholder="Bogotá"
                      className="apple-form-input"
                    />
                  </div>

                  <div className="apple-form-group">
                    <label className="apple-form-label">Estado/País</label>
                    <input
                      type="text"
                      value={formData.state}
                      name="state"
                      onChange={handleInputChange}
                      placeholder="Colombia"
                      className="apple-form-input"
                    />
                  </div>

                  <div className="apple-form-group full-width">
                    <label className="apple-form-label">{UI_FORM_LABELS.ADDRESS}</label>
                    <textarea
                      value={formData.address}
                      name="address"
                      onChange={handleInputChange}
                      placeholder={`${UI_FORM_LABELS.ADDRESS} completa del ${UI_FORM_LABELS.SUPPLIER.toLowerCase()}`}
                      rows="3"
                      className="apple-form-textarea"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="apple-form-section">
                <div className="apple-card apple-card-compact">
                  <h3 className="apple-title-medium">Tipos de Combustible que Suministra</h3>
                  <div className="fuel-types-grid">
                    {Object.entries(FUEL_TYPES).map(([key, label]) => (
                      <div key={key} className="apple-form-group">
                        <div className="apple-form-checkbox">
                          <input
                            type="checkbox"
                            checked={formData.fuelTypes.includes(key)}
                            onChange={() => handleFuelTypeToggle(key)}
                          />
                          <label className="apple-form-checkbox-label">
                            {label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.fuelTypes.length > 0 && (
                  <div className="apple-card apple-card-compact">
                    <h3 className="apple-title-medium">Precios por Litro (Opcional)</h3>
                    <div className="apple-form-row">
                      {formData.fuelTypes.map((fuelType) => (
                        <div key={fuelType} className="apple-form-group">
                          <label className="apple-form-label">{FUEL_TYPES[fuelType]}</label>
                          <div className="apple-input-group">
                            <span className="apple-input-icon">$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={formData.priceList[fuelType] || ''}
                              onChange={(e) => handlePriceChange(fuelType, e.target.value)}
                              placeholder="0.00"
                              className={`apple-form-input ${errors[`price_${fuelType}`] ? 'error' : ''}`}
                            />
                          </div>
                          {errors[`price_${fuelType}`] && (
                            <div className="apple-form-error">
                              {errors[`price_${fuelType}`]}
                            </div>
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
              <div className="apple-form-section">
                <div className="apple-form-row">
                  <div className="apple-form-group">
                    <label className="apple-form-label">Términos de Pago</label>
                    <select
                      value={formData.paymentTerms}
                      name="paymentTerms"
                      onChange={handleInputChange}
                      className="apple-form-select"
                    >
                      <option value="contado">Contado</option>
                      <option value="30dias">30 días</option>
                      <option value="60dias">60 días</option>
                      <option value="90dias">90 días</option>
                    </select>
                  </div>

                  <div className="apple-form-group">
                    <label className="apple-form-label">Límite de Crédito</label>
                    <div className="apple-input-group">
                      <span className="apple-input-icon">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="creditLimit"
                        value={formData.creditLimit}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className={`apple-form-input ${errors.creditLimit ? 'error' : ''}`}
                      />
                    </div>
                    {errors.creditLimit && (
                      <div className="apple-form-error">{errors.creditLimit}</div>
                    )}
                  </div>

                  <div className="apple-form-group">
                    <label className="apple-form-label">Rating</label>
                    <div className="rating-input">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.1"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        className={`apple-form-input ${errors.rating ? 'error' : ''}`}
                      />
                      <div className="apple-card apple-card-compact rating-display">
                        <span className="apple-title-small rating-value">{formData.rating.toFixed(1)}</span>
                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`star ${star <= Math.round(formData.rating) ? 'filled' : ''}`}
                              style={{ color: star <= Math.round(formData.rating) ? 'var(--apple-yellow)' : 'var(--apple-gray-300)' }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {errors.rating && (
                      <div className="apple-form-error">{errors.rating}</div>
                    )}
                  </div>

                  <div className="apple-form-group full-width">
                    <label className="apple-form-label">Notas de Evaluación</label>
                    <textarea
                      name="evaluationNotes"
                      value={formData.evaluationNotes}
                      onChange={handleInputChange}
                      placeholder="Comentarios sobre el desempeño del proveedor..."
                      rows="4"
                      className="apple-form-textarea"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>

      <ModalFooter
        primaryAction={{
          label: loading
            ? isEditing
              ? UI_MESSAGES.LOADING.UPDATING
              : UI_MESSAGES.LOADING.CREATING
            : isEditing
              ? `${UI_ACTIONS.UPDATE} ${UI_FORM_LABELS.SUPPLIER}`
              : `${UI_ACTIONS.CREATE} ${UI_FORM_LABELS.SUPPLIER}`,
          onClick: handleSubmit,
          disabled: loading,
          type: 'submit',
        }}
        secondaryAction={{
          label: UI_ACTIONS.CANCEL,
          onClick: onClose,
        }}
        isLoading={loading}
      />
    </BaseModal>
  );
};

export default SupplierModal;
