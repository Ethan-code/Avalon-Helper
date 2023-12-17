import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/legacy-helper', pathMatch: 'full' },
    { path: 'legacy-helper', loadComponent: () => import('./legacy-helper/legacy-helper.component').then((m) => m.LegacyHelperComponent), }
];
