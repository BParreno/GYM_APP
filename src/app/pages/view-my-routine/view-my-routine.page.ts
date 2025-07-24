import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-view-my-routine',
  templateUrl: './view-my-routine.page.html',
  styleUrls: ['./view-my-routine.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ViewMyRoutinePage implements OnInit {
  routine: any = null;
  loading = true;

  constructor(
    private router: Router,
    private firestore: Firestore,
    private auth: Auth,
    private toast: ToastController
  ) {}

  ngOnInit() {
    authState(this.auth).subscribe(async user => {
      if (user) {
        const docRef = doc(this.firestore, `users/${user.uid}/assignedRoutine/routine`);
        const snap = await getDoc(docRef);
        this.loading = false;

        if (snap.exists()) {
          this.routine = snap.data();
        } else {
          this.presentToast('No tienes una rutina asignada');
        }
      }
    });
  }

  async presentToast(message: string) {
    const toast = await this.toast.create({ message, duration: 2500 });
    toast.present();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
