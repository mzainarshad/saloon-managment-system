import { Routes } from '@angular/router';
export const REPORT_ROUTES: Routes = [
  { path: 'sales', loadComponent: () => import('./sales/sales-report.component').then(m => m.SalesReportComponent) },
  { path: 'staff', loadComponent: () => import('./staff/staff-report.component').then(m => m.StaffReportComponent) },
  { path: 'services', loadComponent: () => import('./services/services-report.component').then(m => m.ServicesReportComponent) },
  { path: '', redirectTo: 'sales', pathMatch: 'full' },
];
