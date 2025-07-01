import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'profile-setup-weight',
    pathMatch: 'full',
  },
  {
    path: 'profile-setup-weight',
    loadComponent: () => import('./pages/profile/profile-setup-weight/profile-setup-weight.page').then( m => m.ProfileSetupWeightPage)
  },
  {
    path: 'profile-setup-height',
    loadComponent: () => import('./pages/profile/profile-setup-height/profile-setup-height.page').then( m => m.ProfileSetupHeightPage)
  },

];
