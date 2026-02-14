import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'cms',
        loadChildren: () => import('./cms/cms.routes').then(m => m.cmsRoutes)
    },
    { path: '**', redirectTo: '' }
];
