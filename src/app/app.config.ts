import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { refreshTokenInterceptor } from './core/interceptors/refresh-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Configuration HttpClient avec les interceptors
    // L'ordre est important : refreshToken -> error -> auth
    provideHttpClient(
      withInterceptors([
        refreshTokenInterceptor, // D'abord gérer le refresh si 401
        errorInterceptor,         // Ensuite formater les erreurs
        authInterceptor,          // Enfin ajouter le token
      ])
    ),
  ],
};
