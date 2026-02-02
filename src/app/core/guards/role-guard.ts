import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { map, take } from 'rxjs/operators';


export const roleGuard = (allowedRoles: Array<'ADMIN' | 'WAREHOUSE_MANAGER' | 'CLIENT'>): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // S'assurer que l'utilisateur est chargé (stockage) avant de vérifier le rôle
    authService.ensureUserLoaded();

    return authService.currentUser$.pipe(
      take(1),
      map((user) => {
        if (!user) {
          router.navigate(['/login'], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        }

        if (allowedRoles.includes(user.role)) {
          return true;
        } else {
          router.navigate(['/unauthorized']);
          return false;
        }
      })
    );
  };
};

