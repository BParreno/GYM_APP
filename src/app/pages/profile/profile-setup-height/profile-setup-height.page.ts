// src/app/pages/profile/profile-setup-height/profile-setup-height.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile-setup-height',
  templateUrl: './profile-setup-height.page.html',
  styleUrls: ['./profile-setup-height.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ProfileSetupHeightPage implements OnInit {
  heightForm: FormGroup;
  currentUser: User | null = null;
  heights: number[] = []; // Para el rango de alturas

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private firestore: Firestore
  ) {
    this.heightForm = this.fb.group({
      height: ['', [Validators.required, Validators.min(50), Validators.max(250), Validators.pattern('^[0-9]*$')]] // Altura en cm
    });
    this.generateHeights();
  }

  async ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigateByUrl('/login');
      } else {
        this.loadExistingHeight(user.uid);
      }
    });
  }

  generateHeights() {
    for (let i = 120; i <= 210; i++) { // Rango de ejemplo para el scroll
      this.heights.push(i);
    }
  }

  async loadExistingHeight(uid: string) {
    const userData = await this.authService.getUserData(uid);
    if (userData && userData.height) {
      this.heightForm.get('height')?.setValue(userData.height);
    }
  }

  async onNext() {
    if (this.heightForm.invalid) {
      await this.presentAlert('Estatura Inválida', 'Por favor, introduce una estatura válida (entre 50 y 250 cm).');
      return;
    }

    const { height } = this.heightForm.value;

    const loading = await this.loadingController.create({
      message: 'Guardando estatura...',
    });
    await loading.present();

    try {
      if (this.currentUser) {
        await this.authService.updateUserProfileData(this.currentUser.uid, { height: height });
        await loading.dismiss();
        this.router.navigateByUrl('/profile-setup-weight'); // Navegar a la siguiente página
      } else {
        await loading.dismiss();
        await this.presentAlert('Error', 'No hay usuario autenticado para guardar la estatura.');
      }
    } catch (error: any) {
      await loading.dismiss();
      await this.presentAlert('Error', 'Ocurrió un error al guardar la estatura. Intenta de nuevo.');
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