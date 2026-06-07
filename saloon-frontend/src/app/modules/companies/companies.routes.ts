import { Routes } from '@angular/router';

export const COMPANY_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./list/companies-list.component').then(m => m.CompaniesListComponent) },
  { path: 'new', loadComponent: () => import('./form/company-form.component').then(m => m.CompanyFormComponent) },
  { path: ':id/edit', loadComponent: () => import('./form/company-form.component').then(m => m.CompanyFormComponent) },
];
