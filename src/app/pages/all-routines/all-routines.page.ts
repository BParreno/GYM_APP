import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-routines',
  templateUrl: './all-routines.page.html',
  styleUrls: ['./all-routines.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AllRoutinesPage implements OnInit {
  allRoutines = [
    { id: '1', name: 'Rutina de Pecho y Tríceps', duration: '60 minutos', exercises: 5 },
    { id: '2', name: 'Rutina de Piernas Avanzada', duration: '75 minutos', exercises: 6 },
    { id: '3', name: 'Rutina de Brazos y Hombros', duration: '50 minutos', exercises: 8 },
    { id: '4', name: 'Rutina Full Body Express', duration: '40 minutos', exercises: 7 },
  ];

  isAssignModalOpen = false;
  selectedRoutineForAssignment: any = null;
  userIdToAssign: string = '';

  // --- Nuevas propiedades para el modal de crear rutina ---
  isCreateModalOpen = false;
  newRoutine = {
    name: '',
    duration: '',
    exercises: null as number | null // Usamos null para que el input sea opcional o tenga un valor por defecto
  };
  // --------------------------------------------------------

  constructor(private router: Router) { }

  ngOnInit() {
    // En un escenario real, aquí cargarías todas las rutinas desde Firestore.
  }

  // --- Métodos para el modal de crear rutina ---
  createRoutine() {
    // Reiniciar el objeto de la nueva rutina cada vez que se abre el modal
    this.newRoutine = {
      name: '',
      duration: '',
      exercises: null
    };
    this.isCreateModalOpen = true; // Abrir el modal
    console.log('Abriendo modal para crear nueva rutina.');
  }

  saveNewRoutine() {
    // Lógica para "guardar" la nueva rutina (solo en consola por ahora)
    if (this.newRoutine.name && this.newRoutine.duration && this.newRoutine.exercises !== null) {
      console.log('Nueva rutina a guardar (demo):', this.newRoutine);
      // En un escenario real, aquí harías la llamada a Firestore para guardar la rutina
      // Por ejemplo: this.routineService.addRoutine(this.newRoutine).subscribe(...);

      // Opcional: añadirla a la lista visible para la demo
      // const newId = (this.allRoutines.length + 1).toString();
      // this.allRoutines.push({ ...this.newRoutine, id: newId });

      this.isCreateModalOpen = false; // Cerrar el modal
      // Mostrar un mensaje de éxito (ej. IonToast)
    } else {
      console.warn('Por favor, completa todos los campos para la nueva rutina.');
      // Mostrar un mensaje de error al usuario
    }
  }

  cancelCreateRoutine() {
    this.isCreateModalOpen = false; // Cerrar el modal
    console.log('Creación de rutina cancelada.');
  }
  // ----------------------------------------------------

  viewRoutineDetails(routine: any) {
    console.log('Ver detalles de la rutina:', routine.name);
    // En un escenario real, navegarías a una página de detalles de la rutina.
    // this.router.navigateByUrl(`/routine-details/${routine.id}`);
  }

  assignRoutine(routine: any) {
    this.selectedRoutineForAssignment = routine;
    this.isAssignModalOpen = true;
    console.log('Abriendo modal para asignar rutina:', routine.name);
  }

  confirmAssignment() {
    if (this.selectedRoutineForAssignment && this.userIdToAssign) {
      console.log(`Rutina "${this.selectedRoutineForAssignment.name}" asignada al usuario con ID: ${this.userIdToAssign}`);
      // En un escenario real, aquí harías la llamada a Firestore para asignar la rutina al usuario.
      this.isAssignModalOpen = false;
      this.userIdToAssign = ''; // Limpiar el campo
      // Mostrar un mensaje de éxito al usuario.
    } else {
      console.warn('Por favor, selecciona una rutina y/o ingresa un ID de usuario.');
      // Mostrar un mensaje de error.
    }
  }
}