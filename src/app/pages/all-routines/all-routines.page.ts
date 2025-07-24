// src/app/pages/all-routines/all-routines.page.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc, setDoc, collection, addDoc } from '@angular/fire/firestore';

interface Routine {
  id: string;
  name: string;
  duration: string;
  exercises: number;
}

@Component({
  selector: 'app-all-routines',
  templateUrl: './all-routines.page.html',
  styleUrls: ['./all-routines.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AllRoutinesPage implements OnInit {
  allRoutines: Routine[] = [
    { id: '1', name: 'Rutina de Pecho y Tríceps', duration: '60 minutos', exercises: 5 },
    { id: '2', name: 'Rutina de Piernas Avanzada', duration: '75 minutos', exercises: 6 },
    { id: '3', name: 'Rutina de Brazos y Hombros', duration: '50 minutos', exercises: 8 },
    { id: '4', name: 'Rutina Full Body Express', duration: '40 minutos', exercises: 7 }
  ];

  isAssignModalOpen = false;
  selectedRoutineForAssignment: Routine | null = null;
  userIdToAssign = '';

  isCreateModalOpen = false;
  newRoutine: Routine = { id: '', name: '', duration: '', exercises: 0 };

  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);

  ngOnInit() {}

  // Modal de creación
  createRoutine() {
    this.newRoutine = { id: '', name: '', duration: '', exercises: 0 };
    this.isCreateModalOpen = true;
  }

  saveNewRoutine() {
    if (this.newRoutine.name && this.newRoutine.duration && this.newRoutine.exercises > 0) {
      const newId = (this.allRoutines.length + 1).toString();
      this.allRoutines.push({ ...this.newRoutine, id: newId });
      this.isCreateModalOpen = false;
    } else {
      console.warn('Por favor, completa todos los campos.');
    }
  }

  cancelCreateRoutine() {
    this.isCreateModalOpen = false;
  }

  // Modal de asignación
  assignRoutine(routine: Routine) {
    this.selectedRoutineForAssignment = routine;
    this.userIdToAssign = '';
    this.isAssignModalOpen = true;
  }

  async confirmAssignment() {
    if (!this.selectedRoutineForAssignment || !this.userIdToAssign.trim()) {
      console.warn('Selecciona rutina y usuario.');
      return;
    }

    // Verificar rol del usuario
    const userRef = doc(this.firestore, `users/${this.userIdToAssign}`);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();
    if (!userSnap.exists() || data?.role !== 'Principiante') {
      console.warn('Usuario no existe o no es principiante.');
      return;
    }

    // Guardar rutina asignada
    const routineToAssign = {
      ...this.selectedRoutineForAssignment,
      assignedBy: 'Entrenador',
      assignedAt: new Date()
    };
    const assignRef = doc(this.firestore,
      `users/${this.userIdToAssign}/assignedRoutine/routine`);
    await setDoc(assignRef, routineToAssign);

    console.log(`✅ Rutina asignada a ${this.userIdToAssign}`);
    this.userIdToAssign = '';
    this.isAssignModalOpen = false;
  }

  openActions(r: Routine) {
    // Lógica adicional (como ver detalles)
    console.log('Acciones rutina', r);
  }

  viewRoutineDetails(routine: Routine) {
    this.router.navigate(['/routine-detail', routine.id]);
  }
}
