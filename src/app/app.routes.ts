// src/app/app.routes.ts (UNIFICADO Y CORREGIDO PARA EL NUEVO FLUJO DE DEMO)
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta inicial para la demo: Abrir en Seleccionar Estatura
  {
    path: '',
    redirectTo: 'profile-setup-height', // <-- CAMBIADO: Iniciar en Estatura
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
  // Página 2 (para Principiante): Seleccionar Objetivo (Original)
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
  // ----------------------------------------------------------
];