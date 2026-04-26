import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const isAuth = await auth.refreshSession();

    if (isAuth) {
        return true;
    }

    router.navigate(['/cms/login']);
    return false;
};
