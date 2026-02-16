import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { Subject, timer, Subscription } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-cms-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './cms-layout.component.html',
    styleUrl: './cms-layout.component.scss'
})
export class CmsLayoutComponent implements OnInit, OnDestroy {
    sidebarCollapsed = false;
    mobileMenuOpen = false;

    private userActivity = new Subject<void>();
    private destroy$ = new Subject<void>();
    private readonly IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

    navItems = [
        { label: 'Dashboard', icon: 'dashboard', route: '/cms' },
        { label: 'Proyectos', icon: 'work', route: '/cms/projects' },
        { label: 'Habilidades', icon: 'psychology', route: '/cms/skills' },
        { label: 'Redes', icon: 'public', route: '/cms/social' },
        { label: 'Contacto', icon: 'contact_mail', route: '/cms/contacts' },
        { label: 'Idiomas', icon: 'translate', route: '/cms/i18n' },
        { label: 'CVs / Resumes', icon: 'description', route: '/cms/resumes' },
    ];

    constructor(
        private supabase: SupabaseService,
        private router: Router
    ) { }

    ngOnInit() {
        this.setupIdleTimeout();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupIdleTimeout() {
        this.userActivity.pipe(
            switchMap(() => timer(this.IDLE_TIMEOUT)),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            console.log('Idle timeout reached. Logging out...');
            this.logout();
        });

        // Initial trigger
        this.userActivity.next();
    }

    @HostListener('window:mousemove')
    @HostListener('window:keypress')
    @HostListener('window:click')
    @HostListener('window:scroll')
    onActivity() {
        this.userActivity.next();
    }

    toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    closeMobileMenu() {
        this.mobileMenuOpen = false;
    }

    async logout() {
        await this.supabase.signOut();
        this.router.navigate(['/cms/login']);
    }
}
