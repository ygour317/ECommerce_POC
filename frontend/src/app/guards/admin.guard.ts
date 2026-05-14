import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) {
    void router.navigate(['/login']);
    return false;
  }
  if (!auth.isAdmin()) {
    void router.navigate(['/products']);
    return false;
  }
  return true;
};
