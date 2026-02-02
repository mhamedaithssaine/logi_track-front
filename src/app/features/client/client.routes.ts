import { Routes } from '@angular/router';
import { ClientLayout } from '../../core/layout/client-layout/client-layout';

export const routes: Routes = [
  {
    path: '',
    component: ClientLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/client-dashboard').then((m) => m.ClientDashboard),
      },
      {
        path: 'catalogue',
        loadComponent: () => import('./catalogue/catalogue-list').then((m) => m.CatalogueList),
      },
      {
        path: 'catalogue/:sku',
        loadComponent: () => import('./catalogue/catalogue-detail').then((m) => m.CatalogueDetail),
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders/order-list').then((m) => m.OrderList),
      },
      {
        path: 'orders/new',
        loadComponent: () => import('./orders/order-create').then((m) => m.OrderCreate),
      },
      {
        path: 'orders/:id',
        loadComponent: () => import('./orders/order-detail').then((m) => m.OrderDetail),
      },
      {
        path: 'shipments',
        loadComponent: () => import('./shipments/shipment-list').then((m) => m.ShipmentList),
      },
      {
        path: 'shipments/:orderId',
        loadComponent: () => import('./shipments/shipment-detail').then((m) => m.ShipmentDetail),
      },
    ],
  },
];
