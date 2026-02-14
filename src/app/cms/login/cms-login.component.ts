import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
    selector: 'app-cms-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './cms-login.component.html',
    styleUrl: './cms-login.component.scss'
})
export class CmsLoginComponent {
    password = '';
    error = '';
    loading = false;

    constructor(
        private supabase: SupabaseService,
        private router: Router
    ) {
        console.log('CmsLogin: Constructor');
        if (this.supabase.isAuthenticated()) {
            console.log('CmsLogin: Authenticated, redirecting to /cms');
            this.router.navigate(['/cms']);
        } else {
            console.log('CmsLogin: Not authenticated');
        }
    }

    async onSubmit() {
        this.loading = true;
        this.error = '';

        const success = await this.supabase.signIn(this.password);

        if (success) {
            this.router.navigate(['/cms']);
        } else {
            this.error = 'Contraseña incorrecta';
        }

        this.loading = false;
    }
}
