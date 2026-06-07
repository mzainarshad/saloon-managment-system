import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn) return true;
  return router.createUrlTree(['/auth/login']);
};

export const guestGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn) return true;
  return router.createUrlTree(['/dashboard']);
};

/** Only Super Admin can access */
export const superAdminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn) return router.createUrlTree(['/auth/login']);
  if (auth.isSuperAdmin) return true;
  return router.createUrlTree(['/dashboard']);
};

/** Super Admin or Company Admin */
export const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn) return router.createUrlTree(['/auth/login']);
  if (auth.isAdmin) return true;
  return router.createUrlTree(['/dashboard']);
};
