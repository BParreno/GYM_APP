// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta inicial: Abrir en Login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  // Rutas de configuración de perfil

  {
    path: 'profile', // NUEVA PÁGINA: Selección de Sexo
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'profile-setup-gender', // NUEVA PÁGINA: Selección de Sexo
    loadComponent: () => import('./pages/profile/profile-setup-gender/profile-setup-gender.page').then( m => m.ProfileSetupGenderPage)
  },
  {
    path: 'profile-setup-age',
    loadComponent: () => import('./pages/profile/profile-setup-age/profile-setup-age.page').then( m => m.ProfileSetupAgePage)
  },
  {
    path: 'profile-setup-height',
    loadComponent: () => import('./pages/profile/profile-setup-height/profile-setup-height.page').then( m => m.ProfileSetupHeightPage)
  },
  {
    path: 'profile-setup-weight',
    loadComponent: () => import('./pages/profile/profile-setup-weight/profile-setup-weight.page').then( m => m.ProfileSetupWeightPage)
  },
  // La ruta 'home'
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },

  // -------- Rutas de las páginas principales del flujo --------
  {
    path: 'role-selection',
    loadComponent: () => import('./pages/role-selection/role-selection.page').then(m => m.RoleSelectionPage)
  },
  {
    path: 'objective-selection',
    loadComponent: () => import('./pages/objective-selection/objective-selection.page').then(m => m.ObjectiveSelectionPage)
  },
  // objective-selection-intermedio YA NO SE USA (eliminada)
  {
    path: 'view-my-routine',
    loadComponent: () => import('./pages/view-my-routine/view-my-routine.page').then(m => m.ViewMyRoutinePage)
  },


{
  path: 'view-my-routine/:id',
  loadComponent: () => import('./pages/view-my-routine/view-my-routine.page').then(m => m.ViewMyRoutinePage)
}
,

  {
    path: 'select-routine',
    loadComponent: () => import('./pages/select-routine/select-routine.page').then(m => m.SelectRoutinePage)
  },
  {
    path: 'all-routines',
    loadComponent: () => import('./pages/all-routines/all-routines.page').then(m => m.AllRoutinesPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'change-password',
    loadComponent: () => import('./pages/change-password/change-password.page').then( m => m.ChangePasswordPage)
  },
  {
    path: 'verify-account',
    loadComponent: () => import('./pages/verify-account/verify-account.page').then( m => m.VerifyAccountPage)
  },
  {
    path: 'account-recovery',
    loadComponent: () => import('./pages/account-recovery/account-recovery.page').then( m => m.AccountRecoveryPage)
  },
  {
    path: 'create-routine',
    loadComponent: () => import('./pages/create-routine/create-routine/create-routine.page').then( m => m.CreateRoutinePage)
  }

];