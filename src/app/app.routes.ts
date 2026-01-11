import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  // Route de démonstration des toasts (pour les tests)
  {
    path: 'toast-demo',
    loadComponent: () => import('./shared/components/toast-demo/toast-demo').then((m) => m.ToastDemoComponent),
  },

  // Routes publiques (auth)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },
    ],
  },

  // Routes protégées par authentification
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.routes),
  },
  {
    path: 'warehouse',
    canActivate: [authGuard, roleGuard(['WAREHOUSE_MANAGER'])],
    loadChildren: () => import('./features/warehouse/warehouse.routes').then((m) => m.routes),
  },
  {
    path: 'client',
    canActivate: [authGuard, roleGuard(['CLIENT'])],
    loadChildren: () => import('./features/client/client.routes').then((m) => m.routes),
  },

  // Route par défaut
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },

  // Route 403 - Unauthorized
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized').then((m) => m.Unauthorized),
  },

  // Route 404
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found').then((m) => m.NotFound),
  },
];
