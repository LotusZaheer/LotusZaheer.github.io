import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
            }
        ]
    },
    {
        path: 'cms',
        loadChildren: () => import('./cms/cms.routes').then(m => m.cmsRoutes)
    },
    { path: '**', redirectTo: '' }
];
