import { Routes } from '@angular/router';

/**
 * Routes pour le module Admin
 * TODO: Implémenter les routes admin (catalogue, entrepôts, achats, utilisateurs, reporting)
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  // TODO: Ajouter les routes admin
  // {
  //   path: 'dashboard',
  //   loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
  // },
];

