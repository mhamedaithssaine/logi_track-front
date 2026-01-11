import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { API_CONFIG } from '../config/api.config';

/**
 * Interceptor pour ajouter le token JWT aux requêtes authentifiées
 * Ajoute automatiquement "Authorization: Bearer <token>" aux requêtes vers l'API
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Ne pas ajouter le token aux endpoints publics
  const isPublicEndpoint =
    req.url.includes(API_CONFIG.endpoints.auth.login) ||
    req.url.includes(API_CONFIG.endpoints.auth.register) ||
    req.url.includes(API_CONFIG.endpoints.auth.refresh);

  if (isPublicEndpoint) {
    return next(req);
  }

  // Récupérer le token
  const token = authService.getAccessToken();

  if (token) {
    // Cloner la requête et ajouter le header Authorization
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedReq);
  }

  return next(req);
};
