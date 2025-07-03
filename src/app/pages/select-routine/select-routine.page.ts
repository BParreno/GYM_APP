import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

interface Routine {
  id: string;
  name: string;
  duration: string;
  exercises: number;
  imageUrl: string; // <-- AÑADIDO: Propiedad para la URL de la imagen
}

@Component({
  selector: 'app-select-routine',
  templateUrl: './select-routine.page.html',
  styleUrls: ['./select-routine.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SelectRoutinePage implements OnInit {

  availableRoutines: Routine[] = [
    { id: 'p1', name: 'Rutina de Piernas Avanzada', duration: '75 minutos', exercises: 6, imageUrl: 'assets/images/woman-gym 1.png' },
    { id: 'bh1', name: 'Rutina de Brazos y Hombros', duration: '50 minutos', exercises: 8, imageUrl: 'assets/images/woman-gym 4.png' },
    { id: 'fb1', name: 'Rutina Full Body Express', duration: '40 minutos', exercises: 7, imageUrl: 'assets/images/woman-gym 2.png' },
    { id: 'c1', name: 'Rutina de Cardio Intenso', duration: '30 minutos', exercises: 4, imageUrl: 'assets/images/woman-gym 3.png' }
  ];

  selectedRoutine: Routine | null = null;

  constructor(private router: Router) { }

  ngOnInit() { }

  selectSingleRoutine(routine: Routine) {
    if (this.selectedRoutine && this.selectedRoutine.id === routine.id) {
      this.selectedRoutine = null;
    } else {
      this.selectedRoutine = routine;
    }
    console.log('Rutina seleccionada:', this.selectedRoutine ? this.selectedRoutine.name : 'Ninguna');
  }

  isSelected(routine: Routine): boolean {
    return this.selectedRoutine?.id === routine.id;
  }

  viewSelectedRoutine() {
    if (this.selectedRoutine) {
      console.log(`Navegando para ver la rutina: ${this.selectedRoutine.name}`);
      this.router.navigateByUrl('/view-my-routine');
    } else {
      console.warn('Ninguna rutina seleccionada para ver.');
    }
  }
}