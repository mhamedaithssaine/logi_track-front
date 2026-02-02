import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { API_CONFIG } from '../config/api.config';


export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Ne traiter que les erreurs 401 (Unauthorized)
      if (error.status === 401) {
        // Ne pas tenter de refresh sur les endpoints d'authentification
        const isAuthEndpoint =
          req.url.includes(API_CONFIG.endpoints.auth.login) ||
          req.url.includes(API_CONFIG.endpoints.auth.register) ||
          req.url.includes(API_CONFIG.endpoints.auth.refresh);

        if (isAuthEndpoint) {
          return throwError(() => error);
        }

        // Tenter de rafraîchir le token
        return authService.refreshToken().pipe(
          switchMap((refreshResponse) => {
            // Cloner la requête avec le nouveau token
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${refreshResponse.accessToken}`,
              },
            });
            // Réessayer la requête initiale
            return next(clonedReq);
          }),
          catchError((refreshError) => {
            // Si le refresh échoue, déconnecter l'utilisateur
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      // Pour les autres erreurs, les laisser passer
      return throwError(() => error);
    })
  );
};

