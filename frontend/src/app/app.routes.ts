import { Routes } from '@angular/router';
import { SchoolList } from './school/school-list';
import { SchoolForm } from './school/schoolForm/school-form';

export const routes: Routes = [
  { path: '', redirectTo: 'school', pathMatch: 'full' },
  { path: 'school', component: SchoolList },
  { path: 'school/new', component: SchoolForm },
  { path: 'school/:id/edit', component: SchoolForm },
];
