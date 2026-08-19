import {
  HttpInterceptorFn
} from '@angular/common/http';

import {
  catchError,
  throwError
} from 'rxjs';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  const router = inject(Router);

  const token =
    localStorage.getItem(
      'control-gastos-token'
    );

  if (!token) {
    return next(req);
  }

  const authenticatedRequest =
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

  return next(authenticatedRequest).pipe(

    catchError(error => {

      if (error.status === 401) {

        localStorage.removeItem(
          'control-gastos-token'
        );

        localStorage.removeItem(
          'control-gastos-user'
        );

        localStorage.setItem(
          'control-gastos-session-expired',
          'Su sesión ha expirado. Por seguridad, debe iniciar sesión nuevamente.'
        );

        router.navigate(['/login']);

      }

      return throwError(
        () => error
      );

    })

  );

};