import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../models/auth.models';

/**
 * Interceptor pour gérer les erreurs HTTP de manière centralisée
 * Formate les erreurs selon le format de l'API Spring Boot
 * {timestamp, status, message, path, detail}
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur est survenue';

      if (error.error instanceof ErrorEvent) {
        // Erreur côté client (réseau, etc.)
        errorMessage = `Erreur: ${error.error.message}`;
      } else if (error.status === 0) {
        // Erreur CORS ou réseau (status 0)
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré et que CORS est configuré.';
      } else {
        // Erreur côté serveur
        const apiError: ApiError = error.error;

        if (apiError && apiError.message) {
          errorMessage = apiError.message;

          // Ajouter le détail si disponible
          if (apiError.detail) {
            errorMessage += ` - ${apiError.detail}`;
          }
        } else {
          // Format d'erreur non standard
          switch (error.status) {
            case 400:
              errorMessage = 'Requête invalide';
              break;
            case 401:
              errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
              break;
            case 403:
              errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
              break;
            case 404:
              errorMessage = 'Ressource non trouvée';
              break;
            case 409:
              errorMessage = 'Conflit. Cette action n\'est pas possible dans l\'état actuel.';
              break;
            case 500:
              errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
              break;
            default:
              errorMessage = `Erreur ${error.status}: ${error.statusText || 'Erreur inconnue'}`;
          }
        }
      }

      // Log l'erreur pour le débogage
      console.error('Erreur HTTP:', {
        url: req.url,
        status: error.status,
        message: errorMessage,
        error: error.error,
      });

      // Retourner une erreur formatée
      return throwError(() => ({
        ...error.error,
        status: error.status,
        message: errorMessage,
        timestamp: error.error?.timestamp || new Date().toISOString(),
        path: error.error?.path || req.url,
      }));
    })
  );
};

