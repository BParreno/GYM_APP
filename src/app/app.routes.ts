// src/app/app.routes.ts
import { Routes } from '@angular/router';
// No es necesario importar RegisterPage aquí si solo se usa con loadComponent


export const routes: Routes = [
  // Ruta inicial: Abrir en Login
  {
    path: '',
    redirectTo: 'login', // Iniciar en Login
    pathMatch: 'full',
  },
  // Rutas de configuración de perfil (las de tu compañero)
  {
    path: 'profile-setup-weight',
    loadComponent: () => import('./pages/profile/profile-setup-weight/profile-setup-weight.page').then( m => m.ProfileSetupWeightPage)
  },
  {
    path: 'profile-setup-height',
    loadComponent: () => import('./pages/profile/profile-setup-height/profile-setup-height.page').then( m => m.ProfileSetupHeightPage)
  },
  // La ruta 'home' que ya tenías
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },

  // -------- Rutas de las páginas principales del flujo (ya existentes) --------
  // Página 1: Elegir Rol
  {
    path: 'role-selection',
    loadComponent: () => import('./pages/role-selection/role-selection.page').then(m => m.RoleSelectionPage)
  },
  {
    path: 'objective-selection',
    loadComponent: () => import('./pages/objective-selection/objective-selection.page').then(m => m.ObjectiveSelectionPage)
  },
  // Página 2 (para Intermedio): Seleccionar Objetivo (CLONADA)
  {
    path: 'objective-selection-intermedio',
    loadComponent: () => import('./pages/objective-selection-intermedio/objective-selection-intermedio.page').then(m => m.ObjectiveSelectionIntermedioPage)
  },
  // Página 3 (para Principiante): Ver Mi Rutina
  {
    path: 'view-my-routine',
    loadComponent: () => import('./pages/view-my-routine/view-my-routine.page').then(m => m.ViewMyRoutinePage)
  },
  // Página 3 (para Intermedio): Elegir Rutina
  {
    path: 'select-routine',
    loadComponent: () => import('./pages/select-routine/select-routine.page').then(m => m.SelectRoutinePage)
  },
  // Página 2 (para Entrenador): Todas las Rutinas
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
  // La ruta 'register' estaba duplicada en tu código original, la elimino para evitar conflictos
  // {
  //   path: 'register',
  //   loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  // },
  {
    path: 'profile-setup-age',
    loadComponent: () => import('./pages/profile/profile-setup-age/profile-setup-age.page').then( m => m.ProfileSetupAgePage)
  },
  {
    path: 'change-password',
    loadComponent: () => import('./pages/change-password/change-password.page').then( m => m.ChangePasswordPage)
  },
  // **NUEVAS RUTAS DE VERIFICACIÓN Y RECUPERACIÓN DE CUENTA (SIN SUFIJO -CODE)**
  {
    path: 'verify-account',
    loadComponent: () => import('./pages/verify-account/verify-account.page').then( m => m.VerifyAccountPage)
  },
  {
    path: 'account-recovery',
    loadComponent: () => import('./pages/account-recovery/account-recovery.page').then( m => m.AccountRecoveryPage)
  }
];