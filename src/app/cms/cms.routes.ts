import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { CmsLoginComponent } from './login/cms-login.component';
import { CmsLayoutComponent } from './layout/cms-layout.component';
import { CmsDashboardComponent } from './dashboard/cms-dashboard.component';
import { ProjectManagerComponent } from './project-manager/project-manager.component';
import { SocialManagerComponent } from './social-manager/social-manager.component';
import { ContactManagerComponent } from './contact-manager/contact-manager.component';

export const cmsRoutes: Routes = [
    { path: 'login', component: CmsLoginComponent },
    {
        path: '',
        component: CmsLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', component: CmsDashboardComponent },
            { path: 'projects', component: ProjectManagerComponent },
            { path: 'social', component: SocialManagerComponent },
            { path: 'contacts', component: ContactManagerComponent },
        ]
    }
];
