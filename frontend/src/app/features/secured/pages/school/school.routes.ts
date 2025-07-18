import { Routes } from '@angular/router';
import { ROUTES_CONFIG } from '@shared/config/route-paths';

export const SCHOOL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./school-list').then(m => m.SchoolList),
    title: ROUTES_CONFIG['SCHOOLS'].title
  },
  {
    path: 'add',
    loadComponent: () => import('./add-school').then(m => m.AddSchool),
    title: `Add ${ROUTES_CONFIG['SCHOOLS'].title}`
  },
//   {
//     path: ':id',
//     loadComponent: () => import('./edit-school').then(m => m.EditSchool),
//     title: `Edit ${ROUTES_CONFIG['SCHOOLS'].title}`
//   }
];
