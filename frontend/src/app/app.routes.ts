import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/secured/secured.routes').then(m => m.SECURED_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
