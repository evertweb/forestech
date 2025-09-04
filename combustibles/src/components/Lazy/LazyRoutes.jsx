import React, { lazy } from 'react';

// Lazy loading para rutas principales - reduce bundle inicial
export const AdminMainLazy = lazy(() => import('../Admin/AdminMain'));
export const ReportsMainLazy = lazy(() => import('../Reports/ReportsMain'));
export const MovementsMainLazy = lazy(() => import('../Movements/MovementsMain'));
export const VehiclesMainLazy = lazy(() => import('../Vehicles/VehiclesMain'));
export const InventoryMainLazy = lazy(() => import('../Inventory/InventoryMain'));
export const ProductsMainLazy = lazy(() => import('../Products/ProductsMain'));
export const SuppliersMainLazy = lazy(() => import('../Suppliers/SuppliersMain'));
export const MaintenanceMainLazy = lazy(() => import('../Maintenance/MaintenanceMain'));

// Re-export con wrapper para fácil uso
export {
  AdminMainLazy as AdminMain,
  ReportsMainLazy as ReportsMain,
  MovementsMainLazy as MovementsMain,
  VehiclesMainLazy as VehiclesMain,
  InventoryMainLazy as InventoryMain,
  ProductsMainLazy as ProductsMain,
  SuppliersMainLazy as SuppliersMain,
  MaintenanceMainLazy as MaintenanceMain,
};
