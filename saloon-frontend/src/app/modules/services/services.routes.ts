import { Routes } from '@angular/router';
export const SERVICE_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./list/services-list.component').then(m => m.ServicesListComponent) },
  { path: 'new', loadComponent: () => import('./form/service-form.component').then(m => m.ServiceFormComponent) },
  { path: 'categories', loadComponent: () => import('./categories/service-categories.component').then(m => m.ServiceCategoriesComponent) },
  { path: ':id/edit', loadComponent: () => import('./form/service-form.component').then(m => m.ServiceFormComponent) },
];
