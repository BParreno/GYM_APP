import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, doc, setDoc, getDoc, serverTimestamp } from '@angular/fire/firestore';
import { Auth, authState, User } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import variables from '../variables.json';

interface ExerciseSelection {
  muscle: string;
  name: string;
  series: number;
  reps: number;
  durationMin: number;
}
interface VariableExercise {
  name: string;
  durationMin: number;
}

const exerciseData: Record<string, VariableExercise[]> = variables;

@Component({
  selector: 'app-create-routine',
  templateUrl: './create-routine.page.html',
  styleUrls: ['./create-routine.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CreateRoutinePage implements OnInit {
  user: User | null = null;
  name = '';
  muscles: string[] = [];
  exerciseOptions: { muscle: string; exercises: VariableExercise[] }[] = [];
  exercises: ExerciseSelection[] = [];

  private editId: string | null = null;

  constructor(
    private nav: NavController,
    private firestore: Firestore,
    private auth: Auth,
    private toastCtrl: ToastController,
    private route: ActivatedRoute
  ) {
    authState(this.auth).subscribe(u => this.user = u);
    for (const muscle of Object.keys(exerciseData)) {
      this.exerciseOptions.push({ muscle, exercises: exerciseData[muscle] });
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
     if (params['edit']) {
    this.editId = params['edit'];
    this.loadRoutine(params['edit']);
      }
    });
  }

 loading = false;

private async loadRoutine(id: string) {
  if (!this.user) return;
  this.loading = true;
  const docRef = doc(this.firestore, `users/${this.user.uid}/routines/${id}`);
  const snap = await getDoc(docRef);
  this.loading = false;
  if (snap.exists()) {
    const data = snap.data();
    this.name = data.name;
    this.muscles = data.muscles;
    this.exercises = data.exercises;
  } else {
    this.toast('Rutina no encontrada');
    this.nav.back();
  }
}


  async save() {
    if (!this.name.trim()) return this.toast('Debe poner un nombre');
    if (this.muscles.length === 0) return this.toast('Seleccione al menos 1 músculo');
    if (this.exercises.length === 0) return this.toast('Agregue al menos 1 ejercicio');
    for (const ex of this.exercises) {
      if (ex.series < 1 || ex.reps < 1 || ex.durationMin < 1) {
        return this.toast('Series, repeticiones y duración deben ser ≥ 1');
      }
    }

    const totalDuration = this.exercises.reduce((acc, x) => acc + x.durationMin, 0);
    const uid = this.user?.uid;
    if (!uid) return this.toast('No estás autenticado');

    let docRef;
    let id: string;

    if (this.editId) {
      id = this.editId;
      docRef = doc(this.firestore, `users/${uid}/routines/${id}`);
    } else {
      docRef = doc(collection(this.firestore, `users/${uid}/routines`));
      id = docRef.id;
    }

   await setDoc(docRef, {
  id,
  name: this.name,
  muscles: this.muscles,
  exercises: this.exercises,
  totalDuration,
  ...(this.editId ? { updatedAt: serverTimestamp() } : { createdAt: serverTimestamp() })
}, { merge: true });


    this.toast(this.editId ? 'Rutina actualizada ✅' : 'Rutina creada ✅');
    this.nav.back();
  }
async addExercise() {
  this.loading = true;

  // Simula alguna operación asincrónica o procesamiento pesado, si lo hubiera
  // Si no hay async real, puedes hacer un pequeño delay para que el spinner se note
  await new Promise(resolve => setTimeout(resolve, 300)); 

  for (const muscle of this.muscles) {
    const opts = exerciseData[muscle];
    if (opts) {
      for (const ex of opts) {
        if (!this.exercises.find(e => e.name === ex.name && e.muscle === muscle)) {
          this.exercises.push({
            muscle,
            name: ex.name,
            series: 1,
            reps: 1,
            durationMin: ex.durationMin
          });
        }
      }
    }
  }

  this.loading = false;
}


  removeExercise(index: number) {
    this.exercises.splice(index, 1);
  }

  async toast(message: string) {
    const t = await this.toastCtrl.create({ message, duration: 2000, position: 'bottom' });
    await t.present();
  }
  
}
