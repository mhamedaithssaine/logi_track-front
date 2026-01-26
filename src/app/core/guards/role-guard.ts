import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { map, take } from 'rxjs/operators';


export const roleGuard = (allowedRoles: Array<'ADMIN' | 'WAREHOUSE_MANAGER' | 'CLIENT'>): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);


    return authService.currentUser$.pipe(
      take(1),
      map((user) => {
        if (!user) {
          router.navigate(['/auth/login'], {
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

