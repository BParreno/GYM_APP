// src/app/pages/objective-selection-intermedio/objective-selection-intermedio.page.ts (CLONADA PARA INTERMEDIO)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-objective-selection-intermedio', // ¡NOTA EL NUEVO SELECTOR!
  templateUrl: './objective-selection-intermedio.page.html',
  styleUrls: ['./objective-selection-intermedio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ObjectiveSelectionIntermedioPage implements OnInit { // ¡NOTA EL NUEVO NOMBRE DE LA CLASE!
  availableObjectives: string[] = [
    'Bajar De Peso',
    'Aumentar De Peso',
    'Ganar Masa Muscular',
    'Tonificar El Cuerpo',
    'Otros'
  ];

  selectedObjectives: string[] = [];

  constructor(private router: Router) { }

  ngOnInit() { }

  toggleObjective(objective: string) {
    const index = this.selectedObjectives.indexOf(objective);
    if (index > -1) {
      this.selectedObjectives.splice(index, 1);
    } else {
      this.selectedObjectives.push(objective);
    }
    console.log('Objetivos seleccionados (Intermedio):', this.selectedObjectives);
  }

  isSelected(objective: string): boolean {
    return this.selectedObjectives.includes(objective);
  }

  continueToNextPage() {
    if (this.selectedObjectives.length > 0) {
      // ***** NAVEGACIÓN PARA INTERMEDIO *****
      this.router.navigateByUrl('/select-routine'); // Redirige a "Elegir Rutina"
    } else {
      console.warn('Por favor, selecciona al menos un objetivo para continuar.');
      // Puedes usar un IonToast para mostrar un mensaje más amigable al usuario.
    }
  }
}