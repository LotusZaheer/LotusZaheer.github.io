import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
    selector: 'app-cms-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './cms-layout.component.html',
    styleUrl: './cms-layout.component.scss'
})
export class CmsLayoutComponent {
    sidebarCollapsed = false;

    navItems = [
        { label: 'Dashboard', icon: '📊', route: '/cms' },
        { label: 'Proyectos', icon: '💼', route: '/cms/projects' },
        { label: 'Redes', icon: '🌐', route: '/cms/social' },
        { label: 'Contacto', icon: '📧', route: '/cms/contacts' },
    ];

    constructor(
        private supabase: SupabaseService,
        private router: Router
    ) { }

    toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }

    logout() {
        this.supabase.signOut();
        this.router.navigate(['/cms/login']);
    }
}
