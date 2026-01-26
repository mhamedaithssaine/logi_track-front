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
    ],
  },
];

