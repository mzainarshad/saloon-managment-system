import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./list/users-list.component').then(m => m.UsersListComponent) },
  { path: 'new', loadComponent: () => import('./form/user-form.component').then(m => m.UserFormComponent) },
  { path: ':id/edit', loadComponent: () => import('./form/user-form.component').then(m => m.UserFormComponent) },
];
