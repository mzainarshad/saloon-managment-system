import { Routes } from '@angular/router';
export const CUSTOMER_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./list/customers-list.component').then(m => m.CustomersListComponent) },
  { path: 'new', loadComponent: () => import('./form/customer-form.component').then(m => m.CustomerFormComponent) },
  { path: ':id/edit', loadComponent: () => import('./form/customer-form.component').then(m => m.CustomerFormComponent) },
];
