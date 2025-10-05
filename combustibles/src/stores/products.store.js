/**
 * ⛽ Products Store - Zustand
 * 
 * Store para manejo de productos (tipos de combustibles dinámicos).
 * Los usuarios pueden crear sus propios tipos de combustibles.
 * Integra con el hook useProducts y FirebaseProductsService.
 * 
 * @module stores/products
 * 
 * @example
 * ```javascript
 * import { useProductsStore } from '@/stores/products.store';
 * 
 * function ProductsComponent() {
 *   const { products, loading, fetchProducts, createProduct } = useProductsStore();
 *   
 *   useEffect(() => {
 *     fetchProducts();
 *   }, [fetchProducts]);
 * }
 * ```
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import FirebaseProductsService from '../services/FirebaseProductsService';

// Instancia del servicio
const productsService = new FirebaseProductsService();

/**
 * Products Store State
 * 
 * @typedef {Object} ProductsState
 * @property {Array<Object>} products - Lista de productos (tipos de combustibles)
 * @property {boolean} loading - Estado de carga
 * @property {boolean} saving - Estado de guardado
 * @property {string|null} error - Mensaje de error
 * @property {function|null} unsubscribe - Función para cancelar suscripción
 */

const initialState = {
  products: [],
  loading: false,
  saving: false,
  error: null,
  unsubscribe: null,
};

/**
 * useProductsStore - Zustand store for products (fuel types)
 * 
 * @returns {ProductsState & ProductsActions} Products state and actions
 */
export const useProductsStore = create(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        // Estado inicial
        ...initialState,

        // Acciones
        /**
         * Fetch all products (fuel types)
         * 
         * @returns {Promise<void>}
         * 
         * @example
         * await fetchProducts();
         */
        fetchProducts: async () => {
          console.log('⛽ ProductsStore: fetchProducts');
          set({ loading: true, error: null }, false, 'products/fetch');

          try {
            const result = await productsService.getAllProducts();
            
            if (result.success) {
              console.log(`✅ ProductsStore: ${result.data.length} productos cargados`);
              set({ products: result.data, loading: false }, false, 'products/fetchSuccess');
            } else {
              console.error('❌ ProductsStore: Error al cargar productos:', result.error);
              set({ error: result.error, loading: false }, false, 'products/fetchError');
            }
          } catch (error) {
            console.error('❌ ProductsStore: Excepción:', error);
            set({ error: error.message, loading: false }, false, 'products/fetchException');
          }
        },

        /**
         * Fetch only active products
         * 
         * @returns {Promise<void>}
         * 
         * @example
         * await fetchActiveProducts();
         */
        fetchActiveProducts: async () => {
          console.log('⛽ ProductsStore: fetchActiveProducts');
          set({ loading: true, error: null }, false, 'products/fetchActive');

          try {
            const result = await productsService.getActiveProducts();
            
            if (result.success) {
              console.log(`✅ ProductsStore: ${result.data.length} productos activos`);
              set({ products: result.data, loading: false }, false, 'products/fetchActiveSuccess');
            } else {
              console.error('❌ ProductsStore: Error:', result.error);
              set({ error: result.error, loading: false }, false, 'products/fetchActiveError');
            }
          } catch (error) {
            console.error('❌ ProductsStore: Excepción:', error);
            set({ error: error.message, loading: false }, false, 'products/fetchActiveException');
          }
        },

        /**
         * Subscribe to real-time products updates
         * 
         * @returns {function} Unsubscribe function
         * 
         * @example
         * const unsubscribe = subscribeToProducts();
         * // Later: unsubscribe();
         */
        subscribeToProducts: () => {
          console.log('⛽ ProductsStore: subscribeToProducts');
          
          // Cancelar suscripción anterior si existe
          const { unsubscribe: currentUnsub } = get();
          if (currentUnsub) {
            console.log('⛽ ProductsStore: Cancelando suscripción anterior');
            currentUnsub();
          }

          set({ loading: true, error: null }, false, 'products/subscribeStart');

          const unsubscribe = productsService.subscribeToProducts((data, error) => {
            if (error) {
              console.error('❌ ProductsStore: Error en suscripción:', error);
              set({ error, loading: false }, false, 'products/subscribeError');
            } else {
              console.log(`✅ ProductsStore: Suscripción actualizada - ${data.length} productos`);
              set({ products: data, loading: false }, false, 'products/subscribeUpdate');
            }
          });

          set({ unsubscribe }, false, 'products/subscribeActive');
          return unsubscribe;
        },

        /**
         * Unsubscribe from real-time updates
         * 
         * @example
         * unsubscribeFromProducts();
         */
        unsubscribeFromProducts: () => {
          console.log('⛽ ProductsStore: unsubscribeFromProducts');
          const { unsubscribe } = get();
          
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
            set({ unsubscribe: null }, false, 'products/unsubscribe');
          }
        },

        /**
         * Create new product (fuel type)
         * 
         * @param {Object} productData - Product data
         * @returns {Promise<Object>} Result object
         * 
         * @example
         * const result = await createProduct({
         *   name: 'DIESEL PREMIUM',
         *   unit: 'gal',
         *   density: 0.85,
         *   color: '#FFD700'
         * });
         */
        createProduct: async (productData) => {
          console.log('⛽ ProductsStore: createProduct', productData.name);
          set({ saving: true, error: null }, false, 'products/createStart');

          try {
            const result = await productsService.createProduct(productData);

            if (result.success) {
              console.log('✅ ProductsStore: Producto creado');
              set({ saving: false }, false, 'products/createSuccess');
              
              // Refrescar lista
              get().fetchProducts();
            } else {
              console.error('❌ ProductsStore: Error al crear:', result.error);
              set({ error: result.error, saving: false }, false, 'products/createError');
            }

            return result;
          } catch (error) {
            console.error('❌ ProductsStore: Excepción:', error);
            const errorMsg = error.message;
            set({ error: errorMsg, saving: false }, false, 'products/createException');
            return { success: false, error: errorMsg };
          }
        },

        /**
         * Update existing product
         * 
         * @param {string} productId - Product ID
         * @param {Object} updates - Fields to update
         * @returns {Promise<Object>} Result object
         * 
         * @example
         * const result = await updateProduct('product-123', { unit: 'L' });
         */
        updateProduct: async (productId, updates) => {
          console.log('⛽ ProductsStore: updateProduct', productId);
          set({ saving: true, error: null }, false, 'products/updateStart');

          try {
            const result = await productsService.updateProduct(productId, updates);

            if (result.success) {
              console.log('✅ ProductsStore: Producto actualizado');
              set({ saving: false }, false, 'products/updateSuccess');
              
              // Refrescar lista
              get().fetchProducts();
            } else {
              console.error('❌ ProductsStore: Error al actualizar:', result.error);
              set({ error: result.error, saving: false }, false, 'products/updateError');
            }

            return result;
          } catch (error) {
            console.error('❌ ProductsStore: Excepción:', error);
            const errorMsg = error.message;
            set({ error: errorMsg, saving: false }, false, 'products/updateException');
            return { success: false, error: errorMsg };
          }
        },

        /**
         * Delete product
         * 
         * @param {string} productId - Product ID
         * @returns {Promise<Object>} Result object
         * 
         * @example
         * const result = await deleteProduct('product-123');
         */
        deleteProduct: async (productId) => {
          console.log('⛽ ProductsStore: deleteProduct', productId);
          set({ loading: true, error: null }, false, 'products/deleteStart');

          try {
            const result = await productsService.deleteProduct(productId);

            if (result.success) {
              console.log('✅ ProductsStore: Producto eliminado');
              set({ loading: false }, false, 'products/deleteSuccess');
              
              // Refrescar lista
              get().fetchProducts();
            } else {
              console.error('❌ ProductsStore: Error al eliminar:', result.error);
              set({ error: result.error, loading: false }, false, 'products/deleteError');
            }

            return result;
          } catch (error) {
            console.error('❌ ProductsStore: Excepción:', error);
            const errorMsg = error.message;
            set({ error: errorMsg, loading: false }, false, 'products/deleteException');
            return { success: false, error: errorMsg };
          }
        },

        /**
         * Get product by ID
         * 
         * @param {string} id - Product ID
         * @returns {Object|undefined} Product or undefined
         * 
         * @example
         * const product = getProductById('product-123');
         */
        getProductById: (id) => {
          const { products } = get();
          return products.find(p => p.id === id);
        },

        /**
         * Get product by name
         * 
         * @param {string} name - Product name
         * @returns {Object|undefined} Product or undefined
         * 
         * @example
         * const diesel = getProductByName('DIESEL');
         */
        getProductByName: (name) => {
          const { products } = get();
          return products.find(p => p.name === name);
        },

        /**
         * Get products by category
         * 
         * @param {string} category - Category name
         * @returns {Array<Object>} Filtered products
         * 
         * @example
         * const fuels = getProductsByCategory('combustible');
         */
        getProductsByCategory: (category) => {
          const { products } = get();
          return products.filter(p => p.category === category);
        },

        /**
         * Get fuel types formatted for selects/dropdowns
         * Returns array of { value, label, ...metadata }
         * 
         * @returns {Array<Object>} Formatted fuel types
         * 
         * @example
         * const fuelTypes = getFuelTypesForSelect();
         * // [{ value: 'DIESEL', label: 'DIESEL', unit: 'gal', ... }]
         */
        getFuelTypesForSelect: () => {
          const { products } = get();
          return products
            .filter(p => p.isActive !== false)
            .map(p => ({
              value: p.name || p.id,
              label: p.name || p.displayName || p.id,
              unit: p.unit || 'gal',
              // color may exist in legacy rows; keep spread to preserve it if present
              ...p,
            }));
        },

        /**
         * Reset store to initial state
         * 
         * @example
         * reset();
         */
        reset: () => {
          console.log('🔄 ProductsStore: reset');
          const { unsubscribe } = get();
          
          // Cancelar suscripción si existe
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
          }

          set(initialState, false, 'products/reset');
        },
      }),
      {
        name: 'products-store',
        enabled: import.meta.env.DEV,
      }
    )
  )
);

// Selectores útiles
/**
 * Selector to get products count
 */
export const selectProductsCount = (state) => state.products.length;

/**
 * Selector to get active products only
 */
export const selectActiveProducts = (state) =>
  state.products.filter(p => p.active !== false);

/**
 * Selector to get loading state
 */
export const selectProductsLoading = (state) => state.loading;

/**
 * Selector to get fuel types names only
 */
export const selectFuelTypesNames = (state) =>
  state.products.map(p => p.name).filter(Boolean);

