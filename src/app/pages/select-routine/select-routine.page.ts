import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  IonicModule,
  NavController,
  ToastController,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Auth, authState, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Routine {
  id: string;
  name: string;
  totalDuration: number;
  exercises: any[];
}

@Component({
  selector: 'app-select-routine',
  templateUrl: './select-routine.page.html',
  styleUrls: ['./select-routine.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SelectRoutinePage implements OnInit {
  user: User | null = null;
  routines$!: Observable<Routine[]>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private nav: NavController,
    private actionCtrl: ActionSheetController,
    private toastCtrl: ToastController
  ) {
    authState(this.auth).subscribe(u => {
      this.user = u;
      if (u) this.loadRoutines();
    });
  }

  ngOnInit(): void {
    // Método requerido pero podemos mantenerlo vacío
  }

  ionViewWillEnter(): void {
    // Asegura recarga al volver a la vista
    this.loadRoutines();
  }

  loadRoutines(): void {
    if (!this.user) return;
    const col = collection(this.firestore, `users/${this.user.uid}/routines`);
    this.routines$ = collectionData(col, { idField: 'id' }).pipe(
      map((docs: any[]) => docs as Routine[])
    );
  }

  async openActions(r: Routine) {
    const action = await this.actionCtrl.create({
      header: r.name,
      buttons: [
        { text: 'Ver', icon: 'eye', handler: () => this.nav.navigateForward(`/view-my-routine/${r.id}`) },
        { text: 'Modificar', icon: 'create', handler: () => this.nav.navigateForward(`/create-routine?edit=${r.id}`) },
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => this.deleteRoutine(r)
        },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });
    await action.present();
  }

  async deleteRoutine(r: Routine) {
    const docRef = doc(this.firestore, `users/${this.user?.uid}/routines/${r.id}`);
    await deleteDoc(docRef);
    const t = await this.toastCtrl.create({ message: 'Rutina eliminada ✅', duration: 2000, position: 'bottom' });
    await t.present();
    this.loadRoutines();
  }

  goToCreate() {
    this.nav.navigateForward('/create-routine');
  }
}
