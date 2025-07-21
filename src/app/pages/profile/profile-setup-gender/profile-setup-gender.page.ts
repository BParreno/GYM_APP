// src/app/pages/profile/profile-setup-gender/profile-setup-gender.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile-setup-gender',
  templateUrl: './profile-setup-gender.page.html',
  styleUrls: ['./profile-setup-gender.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfileSetupGenderPage implements OnInit {
  selectedGender: 'Masculino' | 'Femenino' | null = null;
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private firestore: Firestore
  ) { }

  async ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigateByUrl('/login'); // Redirigir si no hay usuario autenticado
      } else {
        // Opcional: Cargar el género existente si ya lo tiene
        this.loadExistingGender(user.uid);
      }
    });
  }

  async loadExistingGender(uid: string) {
    const userData = await this.authService.getUserData(uid);
    if (userData && userData.gender) {
      this.selectedGender = userData.gender;
    }
  }

  async selectGender(gender: 'Masculino' | 'Femenino') {
    this.selectedGender = gender;

    const loading = await this.loadingController.create({
      message: 'Guardando sexo...',
    });
    await loading.present();

    try {
      if (this.currentUser && this.selectedGender) {
        await this.authService.updateUserProfileData(this.currentUser.uid, { gender: this.selectedGender });
        await loading.dismiss();
        this.router.navigateByUrl('/profile-setup-age'); // Navegar a la siguiente página (edad)
      } else {
        await loading.dismiss();
        await this.presentAlert('Error', 'No hay usuario autenticado o sexo seleccionado para guardar.');
      }
    } catch (error: any) {
      await loading.dismiss();
      await this.presentAlert('Error', 'Ocurrió un error al guardar el sexo. Intenta de nuevo.');
    }
  }

  private async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Ok']
    });
    await alert.present();
  }
}