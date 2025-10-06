/**
 * suppliersService.js - Servicio de proveedores usando SQL Server DigitalOcean en Firebase Functions
 * Migrado desde combustibles/src/services/suppliersService.js
 * Forestech Combustibles App - TASK-001
 */

import sqlConnection from '../cloudsql/oil-connection.js';

const TABLE_NAME = 'combustibles_suppliers';

export const SUPPLIER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

export const SUPPLIER_TYPES = {
  PROVEEDOR: 'proveedor',
  DISTRIBUIDOR: 'distribuidor',
  MAYORISTA: 'mayorista',
};

export const SUPPLIER_CATEGORIES = {
  COMBUSTIBLES: 'combustibles',
  LUBRICANTES: 'lubricantes',
  ADITIVOS: 'aditivos',
};

export const SUPPLIER_PAYMENT_TERMS = {
  CONTADO: 'contado',
  TREINTA_DIAS: '30dias',
  SESENTA_DIAS: '60dias',
  NOVENTA_DIAS: '90dias',
};

const REQUIRED_FIELDS = ['name', 'type', 'category', 'status', 'paymentTerms'];

const ALLOWED_FIELDS = new Set([
  'name',
  'taxId',
  'type',
  'category',
  'contactPerson',
  'phone',
  'email',
  'city',
  'status',
  'paymentTerms',
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s()+-]{7,15}$/;

const normalizeSupplierCreateData = (data) => ({
  name: typeof data.name === 'string' ? data.name.trim() : '',
  taxId: data.taxId ? data.taxId.trim() : null,
  type: data.type || SUPPLIER_TYPES.PROVEEDOR,
  category: data.category || SUPPLIER_CATEGORIES.COMBUSTIBLES,
  contactPerson: data.contactPerson ? data.contactPerson.trim() : '',
  phone: data.phone ? data.phone.trim() : '',
  email: data.email ? data.email.trim() : '',
  city: data.city ? data.city.trim() : '',
  status: data.status || SUPPLIER_STATUS.ACTIVE,
  paymentTerms: data.paymentTerms || SUPPLIER_PAYMENT_TERMS.CONTADO,
});

const normalizeSupplierUpdateData = (data) => {
  const normalized = {};

  Object.entries(data || {}).forEach(([key, value]) => {
    if (!ALLOWED_FIELDS.has(key)) {
      return;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      normalized[key] = trimmed === '' ? (key === 'taxId' ? null : '') : trimmed;
    } else if (value === null) {
      normalized[key] = null;
    } else if (value !== undefined) {
      normalized[key] = value;
    }
  });

  return normalized;
};

const validateEnumerations = (data) => {
  if (data.type && !Object.values(SUPPLIER_TYPES).includes(data.type)) {
    throw new Error('Tipo de proveedor inválido');
  }

  if (data.category && !Object.values(SUPPLIER_CATEGORIES).includes(data.category)) {
    throw new Error('Categoría de proveedor inválida');
  }

  if (data.status && !Object.values(SUPPLIER_STATUS).includes(data.status)) {
    throw new Error('Estado de proveedor inválido');
  }

  if (data.paymentTerms && !Object.values(SUPPLIER_PAYMENT_TERMS).includes(data.paymentTerms)) {
    throw new Error('Términos de pago inválidos');
  }
};

const validateSupplierData = (data) => {
  REQUIRED_FIELDS.forEach((field) => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      throw new Error(`Campo requerido: ${field}`);
    }
  });

  validateEnumerations(data);

  if (data.email && data.email.trim() && !EMAIL_REGEX.test(data.email)) {
    throw new Error('Formato de email inválido');
  }

  if (data.phone && data.phone.trim() && !PHONE_REGEX.test(data.phone)) {
    throw new Error('Formato de teléfono inválido');
  }
};

const validatePartialSupplierData = (data) => {
  validateEnumerations(data);

  if (data.name !== undefined && (!data.name || data.name.trim() === '')) {
    throw new Error('Campo requerido: name');
  }

  if (data.email && !EMAIL_REGEX.test(data.email)) {
    throw new Error('Formato de email inválido');
  }

  if (data.phone && !PHONE_REGEX.test(data.phone)) {
    throw new Error('Formato de teléfono inválido');
  }
};

const mapSupplierRow = (row) => {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    taxId: row.taxId,
    type: row.type,
    category: row.category,
    contactPerson: row.contactPerson,
    phone: row.phone,
    email: row.email,
    city: row.city,
    status: row.status,
    paymentTerms: row.paymentTerms,
  };
};

const ensureUniqueFields = async (data, excludeId = null) => {
  if (data.name) {
    const query = `SELECT id FROM ${TABLE_NAME} WHERE name = @name${excludeId ? ' AND id != @excludeId' : ''}`;
    const params = excludeId ? { name: data.name, excludeId } : { name: data.name };
    const existing = await sqlConnection.query(query, params);
    if (existing.length > 0) {
      throw new Error(`Ya existe un proveedor con el nombre: ${data.name}`);
    }
  }

  if (data.taxId) {
    const query = `SELECT id FROM ${TABLE_NAME} WHERE taxId = @taxId${excludeId ? ' AND id != @excludeId' : ''}`;
    const params = excludeId ? { taxId: data.taxId, excludeId } : { taxId: data.taxId };
    const existing = await sqlConnection.query(query, params);
    if (existing.length > 0) {
      throw new Error(`Ya existe un proveedor con el NIT/RUT: ${data.taxId}`);
    }
  }
};

export async function createSupplier(supplierData, _userInfo = null) {
  try {
    const normalized = normalizeSupplierCreateData(supplierData || {});

    validateSupplierData(normalized);
    await ensureUniqueFields(normalized);

    const record = {
      ...normalized,
    };

    const columns = Object.keys(record);
    const values = columns.map((_, index) => `@param${index}`);
    const query = `
      INSERT INTO ${TABLE_NAME} (${columns.join(', ')})
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.taxId, INSERTED.type, INSERTED.category,
             INSERTED.contactPerson, INSERTED.phone, INSERTED.email, INSERTED.city,
             INSERTED.status, INSERTED.paymentTerms
      VALUES (${values.join(', ')});
    `;

    const params = {};
    columns.forEach((col, index) => {
      params[`param${index}`] = record[col];
    });

    const result = await sqlConnection.query(query, params);
    return { success: true, data: mapSupplierRow(result[0]) };
  } catch (error) {
    console.error('❌ Error al crear proveedor SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

export async function getAllSuppliers(filters = {}) {
  try {
    let whereClause = '';
    const params = {};
    const conditions = [];

    if (filters.status) {
      conditions.push('status = @status');
      params.status = filters.status;
    }

    if (filters.type) {
      conditions.push('type = @type');
      params.type = filters.type;
    }

    if (filters.category) {
      conditions.push('category = @category');
      params.category = filters.category;
    }

    if (filters.paymentTerms) {
      conditions.push('paymentTerms = @paymentTerms');
      params.paymentTerms = filters.paymentTerms;
    }

    if (filters.search) {
      conditions.push('(name LIKE @search OR taxId LIKE @search OR contactPerson LIKE @search OR city LIKE @search)');
      params.search = `%${filters.search}%`;
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    const limit = Number.isInteger(filters.limit) ? Math.min(Math.max(filters.limit, 1), 500) : 100;
    const offset = Number.isInteger(filters.offset) ? Math.max(filters.offset, 0) : 0;

    const query = `
      SELECT id, name, taxId, type, category, contactPerson, phone, email, city, status, paymentTerms
      FROM ${TABLE_NAME}
      ${whereClause}
      ORDER BY name ASC
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY;
    `;

    const result = await sqlConnection.query(query, params);
    const data = result.map(mapSupplierRow);

    return {
      success: true,
      data,
      meta: {
        limit,
        offset,
        returned: data.length,
        hasMore: data.length === limit,
      },
    };
  } catch (error) {
    console.error('❌ Error al obtener proveedores SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

export async function getSupplierById(supplierId) {
  try {
    if (!supplierId) {
      return { success: false, error: 'ID de proveedor requerido' };
    }

    const query = `
      SELECT id, name, taxId, type, category, contactPerson, phone, email, city, status, paymentTerms
      FROM ${TABLE_NAME}
      WHERE id = @id;
    `;

    const result = await sqlConnection.query(query, { id: supplierId });

    if (result.length === 0) {
      return { success: false, error: 'Proveedor no encontrado' };
    }

    return { success: true, data: mapSupplierRow(result[0]) };
  } catch (error) {
    console.error('❌ Error al obtener proveedor SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

export async function updateSupplier(supplierId, updateData, _userInfo = null) {
  try {
    if (!supplierId) {
      return { success: false, error: 'ID de proveedor requerido' };
    }

    const normalized = normalizeSupplierUpdateData(updateData);

    if (Object.keys(normalized).length === 0) {
      return { success: false, error: 'No hay datos para actualizar' };
    }

  validatePartialSupplierData(normalized);
  await ensureUniqueFields(normalized, supplierId);

    const setParts = [];
    const params = { id: supplierId };
    let index = 0;

    Object.entries(normalized).forEach(([column, value]) => {
      setParts.push(`${column} = @param${index}`);
      params[`param${index}`] = value;
      index += 1;
    });

    const query = `
      UPDATE ${TABLE_NAME}
      SET ${setParts.join(', ')}
      WHERE id = @id;
    `;

    await sqlConnection.execute(query, params);

    return await getSupplierById(supplierId);
  } catch (error) {
    console.error('❌ Error al actualizar proveedor SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteSupplier(supplierId) {
  try {
    if (!supplierId) {
      return { success: false, error: 'ID de proveedor requerido' };
    }

    const query = `DELETE FROM ${TABLE_NAME} WHERE id = @id`;
    await sqlConnection.execute(query, { id: supplierId });

    return { success: true, message: 'Proveedor eliminado exitosamente' };
  } catch (error) {
    console.error('❌ Error al eliminar proveedor SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}