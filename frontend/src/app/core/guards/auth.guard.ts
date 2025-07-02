import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { LoginApiService } from '../../../lib/login/api';

export const authGuard: CanActivateFn = (route, state) => {
  const loginApi = inject(LoginApiService);
  const router = inject(Router);

  if (loginApi.isLoggedIn()) {
    return true;
  }

  // Redirect to login page with return url
  router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
  return false;
}; 