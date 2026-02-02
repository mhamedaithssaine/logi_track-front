import { Routes } from '@angular/router';
import { AdminLayout } from '../../core/layout/admin-layout/admin-layout';

/**
 * Routes pour le module Admin
 */
export const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.AdminDashboard),
      },
      {
        path: 'products',
        loadComponent: () => import('./products/product-list/product-list').then((m) => m.ProductList),
      },
      {
        path: 'products/new',
        loadComponent: () => import('./products/product-form/product-form').then((m) => m.ProductForm),
      },
      {
        path: 'products/:sku/edit',
        loadComponent: () => import('./products/product-form/product-form').then((m) => m.ProductForm),
      },
      {
        path: 'suppliers',
        loadComponent: () => import('./suppliers/supplier-list/supplier-list').then((m) => m.SupplierList),
      },
      {
        path: 'suppliers/new',
        loadComponent: () => import('./suppliers/supplier-form/supplier-form').then((m) => m.SupplierForm),
      },
      {
        path: 'suppliers/:id/edit',
        loadComponent: () => import('./suppliers/supplier-form/supplier-form').then((m) => m.SupplierForm),
      },
      {
        path: 'warehouses',
        loadComponent: () => import('./warehouses/warehouse-list/warehouse-list').then((m) => m.WarehouseList),
      },
      {
        path: 'warehouses/new',
        loadComponent: () => import('./warehouses/warehouse-form/warehouse-form').then((m) => m.WarehouseForm),
      },
      {
        path: 'warehouses/:code/edit',
        loadComponent: () => import('./warehouses/warehouse-form/warehouse-form').then((m) => m.WarehouseForm),
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders/admin-order-list').then((m) => m.AdminOrderList),
      },
      {
        path: 'users',
        redirectTo: 'users/warehouse-managers',
        pathMatch: 'full',
      },
      {
        path: 'users/warehouse-managers',
        loadComponent: () =>
          import('./users/warehouse-managers/warehouse-manager-list').then((m) => m.WarehouseManagerList),
      },
      {
        path: 'users/warehouse-managers/new',
        loadComponent: () =>
          import('./users/warehouse-managers/warehouse-manager-form').then((m) => m.WarehouseManagerForm),
      },
      {
        path: 'users/warehouse-managers/:id/edit',
        loadComponent: () =>
          import('./users/warehouse-managers/warehouse-manager-form').then((m) => m.WarehouseManagerForm),
      },
      {
        path: 'users/clients',
        loadComponent: () => import('./users/clients/client-list').then((m) => m.ClientList),
      },
      {
        path: 'users/clients/new',
        loadComponent: () => import('./users/clients/client-form').then((m) => m.ClientForm),
      },
      {
        path: 'users/clients/:id/edit',
        loadComponent: () => import('./users/clients/client-form').then((m) => m.ClientForm),
      },
      {
        path: 'purchase-orders',
        loadComponent: () =>
          import('./purchase-orders/admin-purchase-order-list').then((m) => m.AdminPurchaseOrderList),
      },
      {
        path: 'carriers',
        loadComponent: () => import('./carriers/carrier-list').then((m) => m.CarrierList),
      },
      {
        path: 'reporting',
        loadComponent: () =>
          import('./reporting/admin-reporting').then((m) => m.AdminReporting),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/admin-settings').then((m) => m.AdminSettings),
      },
    ],
  },
];

