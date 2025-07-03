// src/app/pages/role-selection/role-selection.page.ts (MODIFICADO)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.page.html',
  styleUrls: ['./role-selection.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RoleSelectionPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  selectRole(role: string) {
    console.log('Rol seleccionado:', role);

    switch (role) {
      case 'principiante':
        // Principiante va a la página ORIGINAL de seleccionar objetivo
        this.router.navigateByUrl('/objective-selection');
        break;
      case 'intermedio':
        // Intermedio va a la página CLONADA de seleccionar objetivo
        this.router.navigateByUrl('/objective-selection-intermedio');
        break;
      case 'entrenador':
        // Entrenador va directamente a la página de todas las rutinas
        this.router.navigateByUrl('/all-routines');
        break;
      default:
        console.warn('Rol no reconocido:', role);
        break;
    }
  }
}