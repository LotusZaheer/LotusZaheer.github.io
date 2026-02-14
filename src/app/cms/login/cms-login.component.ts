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
    email = '';
    password = '';
    error = '';
    loading = false;

    constructor(
        private supabase: SupabaseService,
        private router: Router
    ) {
        if (this.supabase.isAuthenticated()) {
            this.router.navigate(['/cms']);
        }
    }

    async onSubmit() {
        if (!this.email || !this.password) {
            this.error = 'Por favor ingresa email y contraseña';
            return;
        }

        this.loading = true;
        this.error = '';

        const success = await this.supabase.signIn(this.email, this.password);

        if (success) {
            this.router.navigate(['/cms']);
        } else {
            this.error = 'Credenciales inválidas';
        }

        this.loading = false;
    }
}
