import { Routes } from '@angular/router';
import { authGuard, guestGuard, superAdminGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: 'dashboard', loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'appointments', loadChildren: () => import('./modules/appointments/appointments.routes').then(m => m.APPOINTMENT_ROUTES) },
      { path: 'customers', loadChildren: () => import('./modules/customers/customers.routes').then(m => m.CUSTOMER_ROUTES) },
      { path: 'staff', loadChildren: () => import('./modules/staff/staff.routes').then(m => m.STAFF_ROUTES) },
      { path: 'services', loadChildren: () => import('./modules/services/services.routes').then(m => m.SERVICE_ROUTES) },
      { path: 'products', loadChildren: () => import('./modules/products/products.routes').then(m => m.PRODUCT_ROUTES) },
      { path: 'pos', loadComponent: () => import('./modules/pos/pos.component').then(m => m.PosComponent) },
      { path: 'reports', loadChildren: () => import('./modules/reports/reports.routes').then(m => m.REPORT_ROUTES) },
      { path: 'marketing', loadComponent: () => import('./modules/marketing/marketing.component').then(m => m.MarketingComponent) },
      { path: 'settings', loadComponent: () => import('./modules/settings/settings.component').then(m => m.SettingsComponent) },
      // Super Admin only
      {
        path: 'companies',
        canActivate: [superAdminGuard],
        loadChildren: () => import('./modules/companies/companies.routes').then(m => m.COMPANY_ROUTES),
      },
      // Super Admin + Company Admin
      {
        path: 'users',
        canActivate: [adminGuard],
        loadChildren: () => import('./modules/users/users.routes').then(m => m.USER_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];
