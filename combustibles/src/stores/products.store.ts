/**
 * ⛽ Products Store - Zustand (TypeScript)
 * 
 * Store para manejo de productos (tipos de combustibles dinámicos).
 * Los usuarios pueden crear sus propios tipos de combustibles.
 * Integra con FirebaseProductsService.
 * 
 * @module stores/products
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type { ProductsState } from '../types/store';
import type { Product } from '../types/models';
import type { Result } from '../types/api';
// @ts-expect-error - Service not yet migrated to TypeScript
import FirebaseProductsService from '../services/FirebaseProductsService';

const productsService = new FirebaseProductsService();

const initialState = {
  products: [],
  loading: false,
  saving: false,
  error: null,
  unsubscribe: null,
};

export const useProductsStore = create<ProductsState>()(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        ...initialState,

        fetchProducts: async (): Promise<void> => {
          console.log('⛽ ProductsStore: fetchProducts');
          set({ loading: true, error: null }, false, 'products/fetchStart');

          try {
            const result = await productsService.getAllProducts();
            
            if (result.success) {
              console.log(`✅ ProductsStore: ${result.data.length} productos cargados`);
              set({ products: result.data, loading: false }, false, 'products/fetchSuccess');
            } else {
              console.error('❌ ProductsStore: Error:', result.error);
              set({ error: result.error, loading: false }, false, 'products/fetchError');
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ ProductsStore: Exception:', error);
            set({ error: errorMsg, loading: false }, false, 'products/fetchException');
          }
        },

        fetchActiveProducts: async (): Promise<void> => {
          console.log('⛽ ProductsStore: fetchActiveProducts');
          set({ loading: true, error: null }, false, 'products/fetchActiveStart');

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
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ ProductsStore: Exception:', error);
            set({ error: errorMsg, loading: false }, false, 'products/fetchActiveException');
          }
        },

        subscribeToProducts: () => {
          console.log('⛽ ProductsStore: subscribeToProducts');
          
          const { unsubscribe: currentUnsub } = get();
          if (currentUnsub) {
            console.log('⛽ ProductsStore: Cancelando suscripción anterior');
            currentUnsub();
          }

          set({ loading: true, error: null }, false, 'products/subscribeStart');

          const unsubscribe = productsService.subscribeToProducts((data: any, error: any) => {
            if (error) {
              console.error('❌ ProductsStore: Error en suscripción:', error);
              set({ error, loading: false }, false, 'products/subscribeError');
            } else {
              console.log(`✅ ProductsStore: ${data.length} productos actualizados`);
              set({ products: data, loading: false }, false, 'products/subscribeUpdate');
            }
          });

          set({ unsubscribe }, false, 'products/subscribeActive');
          return unsubscribe;
        },

        unsubscribeFromProducts: () => {
          console.log('⛽ ProductsStore: unsubscribeFromProducts');
          const { unsubscribe } = get();
          
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
            set({ unsubscribe: null }, false, 'products/unsubscribe');
          }
        },

        createProduct: async (productData: Partial<Product>): Promise<Result<Product>> => {
          console.log('⛽ ProductsStore: createProduct', productData.name);
          set({ saving: true, error: null }, false, 'products/createStart');

          try {
            const result = await productsService.createProduct(productData);

            if (result.success) {
              console.log('✅ ProductsStore: Producto creado');
              set({ saving: false }, false, 'products/createSuccess');
              get().fetchProducts();
            } else {
              console.error('❌ ProductsStore: Error:', result.error);
              set({ error: result.error, saving: false }, false, 'products/createError');
            }

            return result;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ ProductsStore: Exception:', error);
            set({ error: errorMsg, saving: false }, false, 'products/createException');
            return { success: false, error: errorMsg };
          }
        },

        updateProduct: async (id: string, productData: Partial<Product>): Promise<Result<Product>> => {
          console.log('⛽ ProductsStore: updateProduct', id);
          set({ saving: true, error: null }, false, 'products/updateStart');

          try {
            const result = await productsService.updateProduct(id, productData);

            if (result.success) {
              console.log('✅ ProductsStore: Producto actualizado');
              set({ saving: false }, false, 'products/updateSuccess');
              get().fetchProducts();
            } else {
              console.error('❌ ProductsStore: Error:', result.error);
              set({ error: result.error, saving: false }, false, 'products/updateError');
            }

            return result;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ ProductsStore: Exception:', error);
            set({ error: errorMsg, saving: false }, false, 'products/updateException');
            return { success: false, error: errorMsg };
          }
        },

        deleteProduct: async (id: string): Promise<Result<void>> => {
          console.log('⛽ ProductsStore: deleteProduct', id);
          set({ saving: true, error: null }, false, 'products/deleteStart');

          try {
            const result = await productsService.deleteProduct(id);

            if (result.success) {
              console.log('✅ ProductsStore: Producto eliminado');
              set({ saving: false }, false, 'products/deleteSuccess');
              get().fetchProducts();
            } else {
              console.error('❌ ProductsStore: Error:', result.error);
              set({ error: result.error, saving: false }, false, 'products/deleteError');
            }

            return result;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ ProductsStore: Exception:', error);
            set({ error: errorMsg, saving: false }, false, 'products/deleteException');
            return { success: false, error: errorMsg };
          }
        },

        getProductById: (id: string): Product | undefined => {
          const { products } = get();
          return products.find((p) => p.id === id);
        },

        getProductByName: (name: string): Product | undefined => {
          const { products } = get();
          return products.find((p) => p.name.toLowerCase() === name.toLowerCase());
        },

        getProductsByCategory: (category: string): Product[] => {
          const { products } = get();
          return products.filter((p) => p.category === category);
        },

        getFuelTypesForSelect: () => {
          const { products } = get();
          return products
            .filter((p) => p.active)
            .map((p) => ({
              value: p.name,
              label: p.name,
              unit: p.unit,
            }));
        },

        reset: () => {
          console.log('🔄 ProductsStore: reset');
          get().unsubscribeFromProducts();
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

// Selectores
export const selectProductsCount = (state: ProductsState): number => state.products.length;
export const selectActiveProducts = (state: ProductsState): Product[] =>
  state.products.filter((p) => p.active);
export const selectProductsLoading = (state: ProductsState): boolean => state.loading;
export const selectFuelTypesNames = (state: ProductsState): string[] =>
  state.products.filter((p) => p.active).map((p) => p.name);
