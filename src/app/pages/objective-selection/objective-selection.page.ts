// src/app/pages/objective-selection/objective-selection.page.ts (AHORA SOLO PARA PRINCIPIANTE)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-objective-selection',
  templateUrl: './objective-selection.page.html',
  styleUrls: ['./objective-selection.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ObjectiveSelectionPage implements OnInit {
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
    console.log('Objetivos seleccionados:', this.selectedObjectives);
  }

  isSelected(objective: string): boolean {
    return this.selectedObjectives.includes(objective);
  }

  continueToNextPage() {
    if (this.selectedObjectives.length > 0) {
      // ***** NAVEGACIÓN PARA PRINCIPIANTE *****
      this.router.navigateByUrl('/view-my-routine'); // Redirige a "Mi Rutina"
    } else {
      console.warn('Por favor, selecciona al menos un objetivo para continuar.');
      // Puedes usar un IonToast para mostrar un mensaje más amigable al usuario.
    }
  }
}