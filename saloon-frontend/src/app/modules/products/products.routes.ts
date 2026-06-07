import { Routes } from '@angular/router';
export const PRODUCT_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./list/products-list.component').then(m => m.ProductsListComponent) },
  { path: 'new', loadComponent: () => import('./form/product-form.component').then(m => m.ProductFormComponent) },
  { path: ':id/edit', loadComponent: () => import('./form/product-form.component').then(m => m.ProductFormComponent) },
];
