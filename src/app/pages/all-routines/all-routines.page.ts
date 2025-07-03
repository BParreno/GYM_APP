import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

// Definición de la interfaz Routine (sin imageUrl)
interface Routine {
  id: string;
  name: string;
  duration: string;
  exercises: number | null;
  // imageUrl: string; // <-- ELIMINADO
}

@Component({
  selector: 'app-all-routines',
  templateUrl: './all-routines.page.html',
  styleUrls: ['./all-routines.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AllRoutinesPage implements OnInit {
  // Datos de las rutinas, ahora sin la propiedad imageUrl
  allRoutines: Routine[] = [
    { id: '1', name: 'Rutina de Pecho y Tríceps', duration: '60 minutos', exercises: 5 },
    { id: '2', name: 'Rutina de Piernas Avanzada', duration: '75 minutos', exercises: 6 },
    { id: '3', name: 'Rutina de Brazos y Hombros', duration: '50 minutos', exercises: 8 },
    { id: '4', name: 'Rutina Full Body Express', duration: '40 minutos', exercises: 7 },
  ];

  isAssignModalOpen = false;
  selectedRoutineForAssignment: any = null;
  userIdToAssign: string = '';

  isCreateModalOpen = false;
  newRoutine = {
    name: '',
    duration: '',
    exercises: null as number | null
  };

  constructor(private router: Router) { }

  ngOnInit() { }

  createRoutine() {
    this.newRoutine = {
      name: '',
      duration: '',
      exercises: null
    };
    this.isCreateModalOpen = true;
    console.log('Abriendo modal para crear nueva rutina.');
  }

  saveNewRoutine() {
    if (this.newRoutine.name && this.newRoutine.duration && this.newRoutine.exercises !== null) {
      console.log('Nueva rutina a guardar (demo):', this.newRoutine);
      const newId = (this.allRoutines.length + 1).toString();
      this.allRoutines.push({
        ...this.newRoutine,
        id: newId,
        exercises: this.newRoutine.exercises,
        // imageUrl: `assets/images/woman-gym-2.png` // <-- ELIMINADO
      });
      this.isCreateModalOpen = false;
    } else {
      console.warn('Por favor, completa todos los campos para la nueva rutina.');
    }
  }

  cancelCreateRoutine() {
    this.isCreateModalOpen = false;
    console.log('Creación de rutina cancelada.');
  }

  viewRoutineDetails(routine: any) {
    console.log('Ver detalles de la rutina:', routine.name);
  }

  assignRoutine(routine: any) {
    this.selectedRoutineForAssignment = routine;
    this.isAssignModalOpen = true;
    console.log('Abriendo modal para asignar rutina:', routine.name);
  }

  confirmAssignment() {
    if (this.selectedRoutineForAssignment && this.userIdToAssign) {
      console.log(`Rutina "${this.selectedRoutineForAssignment.name}" asignada al usuario con ID: ${this.userIdToAssign}`);
      this.isAssignModalOpen = false;
      this.userIdToAssign = '';
    } else {
      console.warn('Por favor, selecciona una rutina y/o ingresa un ID de usuario.');
    }
  }
}