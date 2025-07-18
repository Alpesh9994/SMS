import { Routes } from '@angular/router';
import { ROUTES_CONFIG } from '@shared/config/route-paths';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard').then(m => m.Dashboard),
    title: ROUTES_CONFIG['DASHBOARD'].title
  }
];
