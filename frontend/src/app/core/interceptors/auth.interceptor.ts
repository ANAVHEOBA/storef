import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginApiService } from '../../../lib/login/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginApiService);
  const router = inject(Router);
  const token = loginService.getToken();

  const publicEndpoints = [
    '/auth/login',
    '/auth/register',
    '/auth/verify-email'
  ];

  const isPublic = publicEndpoints.some(url => req.url.includes(url));

  if (isPublic) {
    return next(req);
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    if (req.url.includes('/videos/') || req.url.includes('/profile/')) {
      loginService.logout();
      router.navigate(['/login'], {
        queryParams: { returnUrl: router.url }
      });
    }
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('Auth error (401). Logging out...');
        loginService.logout();
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url }
        });
      } else if (error.status === 429) {
        console.warn('Rate limit exceeded. Please wait before trying again.');
      } else if (error.status === 404) {
        console.warn('Resource not found:', req.url);
      }
      return throwError(() => error);
    })
  );
}; 