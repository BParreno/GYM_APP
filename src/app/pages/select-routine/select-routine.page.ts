import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

// Definimos una interfaz simple para la rutina
interface Routine {
  id: string;
  name: string;
  duration: string;
  exercises: number;
}

@Component({
  selector: 'app-select-routine',
  templateUrl: './select-routine.page.html',
  styleUrls: ['./select-routine.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SelectRoutinePage implements OnInit {

  // Lista de rutinas disponibles
  availableRoutines: Routine[] = [
    { id: 'p1', name: 'Rutina de Piernas Avanzada', duration: '75 minutos', exercises: 6 },
    { id: 'bh1', name: 'Rutina de Brazos y Hombros', duration: '50 minutos', exercises: 8 },
    { id: 'fb1', name: 'Rutina Full Body Express', duration: '40 minutos', exercises: 7 },
    { id: 'c1', name: 'Rutina de Cardio Intenso', duration: '30 minutos', exercises: 4 }
  ];

  // Variable para almacenar la rutina seleccionada (solo una a la vez)
  selectedRoutine: Routine | null = null;

  constructor(private router: Router) { }

  ngOnInit() { }

  /**
   * Selecciona una única rutina. Deselecciona la anterior si existe.
   * @param routine La rutina a seleccionar.
   */
  selectSingleRoutine(routine: Routine) {
    if (this.selectedRoutine && this.selectedRoutine.id === routine.id) {
      // Si ya está seleccionada y se hace clic de nuevo, la deselecciona
      this.selectedRoutine = null;
    } else {
      // Selecciona la nueva rutina
      this.selectedRoutine = routine;
    }
    console.log('Rutina seleccionada:', this.selectedRoutine ? this.selectedRoutine.name : 'Ninguna');
    // En una app real, aquí podrías guardar la selección del usuario.
  }

  /**
   * Verifica si una rutina específica es la actualmente seleccionada.
   * Se usa en el HTML para aplicar estilos o iconos.
   * @param routine La rutina a verificar.
   * @returns true si es la seleccionada, false en caso contrario.
   */
  isSelected(routine: Routine): boolean {
    return this.selectedRoutine?.id === routine.id;
  }

  /**
   * Redirige a la página de "Ver Mi Rutina" si hay una rutina seleccionada.
   */
  viewSelectedRoutine() {
    if (this.selectedRoutine) {
      console.log(`Navegando para ver la rutina: ${this.selectedRoutine.name}`);
      // Aquí podrías pasar el ID de la rutina seleccionada como un parámetro si view-my-routine lo necesita
      // Por ejemplo: this.router.navigate(['/view-my-routine', this.selectedRoutine.id]);
      this.router.navigateByUrl('/view-my-routine');
    } else {
      console.warn('Ninguna rutina seleccionada para ver.');
    }
  }
}