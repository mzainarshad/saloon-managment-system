import { Routes } from '@angular/router';
export const APPOINTMENT_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./list/appointments-list.component').then(m => m.AppointmentsListComponent) },
  { path: 'new', loadComponent: () => import('./form/appointment-form.component').then(m => m.AppointmentFormComponent) },
  { path: ':id/edit', loadComponent: () => import('./form/appointment-form.component').then(m => m.AppointmentFormComponent) },
];
