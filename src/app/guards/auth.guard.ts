import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async () => {
    const supabase = inject(SupabaseService);
    const router = inject(Router);

    console.log('AuthGuard: Checking authentication');
    const isAuth = await supabase.refreshSession();

    if (isAuth) {
        console.log('AuthGuard: Authenticated, allow access');
        return true;
    }

    console.log('AuthGuard: Not authenticated, redirecting to /cms/login');
    router.navigate(['/cms/login']);
    return false;
};
