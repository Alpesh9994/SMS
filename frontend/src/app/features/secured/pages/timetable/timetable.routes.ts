import { Routes } from '@angular/router';
import { ROUTES_CONFIG } from '@shared/config/route-paths';

export const TIMETABLE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./timetable').then(m => m.Timetable),
    title: ROUTES_CONFIG['TIMETABLE'].title
  }
];
