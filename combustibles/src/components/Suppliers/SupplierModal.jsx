/**
 * SupplierModal - Modal para crear/editar proveedores
 * Diseño minimalista sin tabs, scroll vertical simple
 */
import React, { useState, useEffect, useCallback } from 'react';
import BaseModal from '../shared/BaseModal';
import ModalHeader from '../shared/ModalHeader';
import ModalFooter from '../shared/ModalFooter';
import useFormData from '../../hooks/useFormData';
import {
  validationSchemas,
  validateForm as runValidation,
} from '../../utils/validators';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { createSupplier, updateSupplier } from '../../services/FirebaseSuppliersService';
import { useFirebaseProgressContext } from '../../contexts/FirebaseProgressContext';
import {
  UI_ACTIONS,
  UI_FORM_LABELS,
  UI_MESSAGES,
  UI_STATUS,
} from '../../constants';
import '../../styles/supplier-modal-minimal.css';

const SupplierModal = ({ supplier, onClose, onSuccess, onError }) => {
  const { userProfile } = useCombustibles();
  const isEditing = !!supplier;

  // Hook para progreso transparente de Firebase
  const { executeWithProgress } = useFirebaseProgressContext();

  const [loading, setLoading] = useState(false);

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
      city: '',
      status: 'active',
      paymentTerms: 'contado',
    }),
    []
  );

  // Validación centralizada: schema + reglas adicionales
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
    if (!values.paymentTerms)
      extraErrors.paymentTerms = `Los términos de pago son requeridos`;

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
        city: supplier.city || '',
        status: supplier.status || 'active',
        paymentTerms: supplier.paymentTerms || 'contado',
      });
    } else if (!isEditing) {
      resetForm();
    }
  }, [isEditing, supplier, setFormData, resetForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const supplierData = {
        name: formData.name.trim(),
        taxId: formData.taxId.trim(),
        type: formData.type,
        category: formData.category,
        contactPerson: formData.contactPerson.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        status: formData.status,
        paymentTerms: formData.paymentTerms,
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

  const getModalTitle = () => {
    return isEditing
      ? `${UI_ACTIONS.EDIT} ${UI_FORM_LABELS.SUPPLIER}`
      : `Nuevo ${UI_FORM_LABELS.SUPPLIER}`;
  };

  return (
    <BaseModal isOpen={true} onClose={onClose} size="lg" className="apple-modal supplier-modal-minimal">
      <ModalHeader title={getModalTitle()} icon="🚚" onClose={onClose} />

      <div className="supplier-modal-content">
        <form onSubmit={handleSubmit}>
          
          {/* INFORMACIÓN BÁSICA */}
          <div className="minimal-section">
            <h3 className="minimal-section-title">Información Básica</h3>
            
            <div className="minimal-form-grid">
              <div className="minimal-form-group">
                <label className="minimal-label">
                  {UI_FORM_LABELS.NAME} del {UI_FORM_LABELS.SUPPLIER}
                  <span className="minimal-required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  name="name"
                  onChange={handleInputChange}
                  placeholder="Ej: Petrocolombia S.A."
                  className={`minimal-input ${errors.name ? 'error' : ''}`}
                />
                {errors.name && <div className="minimal-error">{errors.name}</div>}
              </div>

              <div className="minimal-form-group minimal-col-2">
                <label className="minimal-label">NIT / Documento</label>
                <input
                  type="text"
                  value={formData.taxId}
                  name="taxId"
                  onChange={handleInputChange}
                  placeholder="123456789-0"
                  className={`minimal-input ${errors.taxId ? 'error' : ''}`}
                />
                {errors.taxId && <div className="minimal-error">{errors.taxId}</div>}
              </div>

              <div className="minimal-form-group minimal-col-2">
                <label className="minimal-label">
                  {UI_FORM_LABELS.TYPE}
                  <span className="minimal-required">*</span>
                </label>
                <select
                  value={formData.type}
                  name="type"
                  onChange={handleInputChange}
                  className={`minimal-input ${errors.type ? 'error' : ''}`}
                >
                  <option value="proveedor">{UI_FORM_LABELS.SUPPLIER}</option>
                  <option value="distribuidor">Distribuidor</option>
                  <option value="mayorista">Mayorista</option>
                </select>
                {errors.type && <div className="minimal-error">{errors.type}</div>}
              </div>

              <div className="minimal-form-group minimal-col-2">
                <label className="minimal-label">
                  {UI_FORM_LABELS.CATEGORY}
                  <span className="minimal-required">*</span>
                </label>
                <select
                  value={formData.category}
                  name="category"
                  onChange={handleInputChange}
                  className={`minimal-input ${errors.category ? 'error' : ''}`}
                >
                  <option value="combustibles">Combustibles</option>
                  <option value="lubricantes">Lubricantes</option>
                  <option value="aditivos">Aditivos</option>
                </select>
                {errors.category && <div className="minimal-error">{errors.category}</div>}
              </div>

              <div className="minimal-form-group minimal-col-2">
                <label className="minimal-label">{UI_FORM_LABELS.STATUS}</label>
                <select
                  value={formData.status}
                  name="status"
                  onChange={handleInputChange}
                  className="minimal-input"
                >
                  <option value="active">{UI_STATUS.ACTIVE}</option>
                  <option value="inactive">{UI_STATUS.INACTIVE}</option>
                  <option value="suspended">Suspendido</option>
                </select>
              </div>

              <div className="minimal-form-group minimal-col-2">
                <label className="minimal-label">Términos de Pago</label>
                <select
                  value={formData.paymentTerms}
                  name="paymentTerms"
                  onChange={handleInputChange}
                  className={`minimal-input ${errors.paymentTerms ? 'error' : ''}`}
                >
                  <option value="contado">Contado</option>
                  <option value="30dias">30 días</option>
                  <option value="60dias">60 días</option>
                  <option value="90dias">90 días</option>
                </select>
                {errors.paymentTerms && (
                  <div className="minimal-error">{errors.paymentTerms}</div>
                )}
              </div>
            </div>
          </div>

          {/* CONTACTO */}
          <div className="minimal-section">
            <h3 className="minimal-section-title">Contacto</h3>
            
            <div className="minimal-form-grid">
              <div className="minimal-form-group minimal-col-2">
                <label className="minimal-label">Persona de {UI_FORM_LABELS.CONTACT}</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  name="contactPerson"
                  onChange={handleInputChange}
                  placeholder="Nombre del contacto"
                  className="minimal-input"
                />
              </div>

              <div className="minimal-form-group minimal-col-2">
                <label className="minimal-label">{UI_FORM_LABELS.PHONE}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  name="phone"
                  onChange={handleInputChange}
                  placeholder="300 123 4567"
                  className={`minimal-input ${errors.phone ? 'error' : ''}`}
                />
                {errors.phone && <div className="minimal-error">{errors.phone}</div>}
              </div>

              <div className="minimal-form-group minimal-col-2">
                <label className="minimal-label">{UI_FORM_LABELS.EMAIL}</label>
                <input
                  type="email"
                  value={formData.email}
                  name="email"
                  onChange={handleInputChange}
                  placeholder="contacto@proveedor.com"
                  className={`minimal-input ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <div className="minimal-error">{errors.email}</div>}
              </div>

              <div className="minimal-form-group minimal-col-2">
                <label className="minimal-label">Ciudad</label>
                <input
                  type="text"
                  value={formData.city}
                  name="city"
                  onChange={handleInputChange}
                  placeholder="Bogotá"
                  className="minimal-input"
                />
              </div>
            </div>
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
