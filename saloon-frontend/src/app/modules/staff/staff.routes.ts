import { Routes } from '@angular/router';
export const STAFF_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./list/staff-list.component').then(m => m.StaffListComponent) },
  { path: 'new', loadComponent: () => import('./form/staff-form.component').then(m => m.StaffFormComponent) },
  { path: ':id/edit', loadComponent: () => import('./form/staff-form.component').then(m => m.StaffFormComponent) },
];
