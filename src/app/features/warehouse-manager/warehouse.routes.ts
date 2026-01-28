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
          import('../admin/warehouses/warehouse-list/warehouse-list').then((m) => m.WarehouseList),
      },
      {
        path: 'warehouses/new',
        loadComponent: () =>
          import('../admin/warehouses/warehouse-form/warehouse-form').then((m) => m.WarehouseForm),
      },
      {
        path: 'warehouses/:code/edit',
        loadComponent: () =>
          import('../admin/warehouses/warehouse-form/warehouse-form').then((m) => m.WarehouseForm),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./placeholder/placeholder').then((m) => m.WarehousePlaceholder),
        data: {
          title: 'Inventaire',
          message: 'Gestion des niveaux et mouvements de stock. Bientôt disponible.',
        },
      },
      {
        path: 'purchase-orders',
        loadComponent: () =>
          import('./placeholder/placeholder').then((m) => m.WarehousePlaceholder),
        data: {
          title: 'Commandes d\'achat',
          message: 'Création et suivi des commandes d\'achat. Bientôt disponible.',
        },
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./placeholder/placeholder').then((m) => m.WarehousePlaceholder),
        data: {
          title: 'Commandes',
          message: 'Consultation des commandes clients. Bientôt disponible.',
        },
      },
      {
        path: 'shipments',
        loadComponent: () =>
          import('./placeholder/placeholder').then((m) => m.WarehousePlaceholder),
        data: {
          title: 'Expéditions',
          message: 'Gestion des livraisons et suivi des expéditions. Bientôt disponible.',
        },
      },
    ],
  },
];
