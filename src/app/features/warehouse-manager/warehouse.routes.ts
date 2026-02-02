import { Routes } from '@angular/router';
import { WarehouseManagerLayout } from '../../core/layout/warehouse-manager-layout/warehouse-manager-layout';

/**
 * Routes pour le module Warehouse Manager
 * Réutilise les composants admin pour products/suppliers/warehouses (basePath dynamique /warehouse)
 */
export const routes: Routes = [
  {
    path: '',
    component: WarehouseManagerLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/warehouse-manager-dashboard').then((m) => m.WarehouseManagerDashboard),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/warehouse-manager-profile').then((m) => m.WarehouseManagerProfile),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('../admin/products/product-list/product-list').then((m) => m.ProductList),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('../admin/products/product-form/product-form').then((m) => m.ProductForm),
      },
      {
        path: 'products/:sku/edit',
        loadComponent: () =>
          import('../admin/products/product-form/product-form').then((m) => m.ProductForm),
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import('../admin/suppliers/supplier-list/supplier-list').then((m) => m.SupplierList),
      },
      {
        path: 'suppliers/new',
        loadComponent: () =>
          import('../admin/suppliers/supplier-form/supplier-form').then((m) => m.SupplierForm),
      },
      {
        path: 'suppliers/:id/edit',
        loadComponent: () =>
          import('../admin/suppliers/supplier-form/supplier-form').then((m) => m.SupplierForm),
      },
      {
        path: 'warehouses',
        loadComponent: () =>
          import('./warehouse/wm-warehouse-view').then((m) => m.WmWarehouseView),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./inventory/wm-inventory').then((m) => m.WmInventory),
        data: { title: 'Inventaire' },
      },
      {
        path: 'purchase-orders',
        loadComponent: () =>
          import('./purchase-orders/wm-purchase-order-list').then((m) => m.WmPurchaseOrderList),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./orders/wm-order-list').then((m) => m.WmOrderList),
      },
      {
        path: 'shipments',
        loadComponent: () =>
          import('./shipments/wm-shipment-list').then((m) => m.WmShipmentList),
      },
    ],
  },
];
