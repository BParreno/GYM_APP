// src/app/pages/profile/profile-setup-age/profile-setup-age.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile-setup-age',
  templateUrl: './profile-setup-age.page.html',
  styleUrls: ['./profile-setup-age.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ProfileSetupAgePage implements OnInit {
  ageForm: FormGroup;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private firestore: Firestore // Inyectar Firestore
  ) {
    this.ageForm = this.fb.group({
      age: ['', [Validators.required, Validators.min(10), Validators.max(100), Validators.pattern('^[0-9]*$')]]
    });
  }

  async ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigateByUrl('/login'); // Redirigir si no hay usuario autenticado
      } else {
        this.loadExistingAge(user.uid);
      }
    });
  }

  async loadExistingAge(uid: string) {
    const userData = await this.authService.getUserData(uid);
    if (userData && userData.age) {
      this.ageForm.get('age')?.setValue(userData.age);
    }
  }

  async onNext() {
    if (this.ageForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Edad Inválida',
        message: 'Por favor, introduce una edad válida (entre 10 y 100 años).',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    const { age } = this.ageForm.value;

    const loading = await this.loadingController.create({
      message: 'Guardando edad...',
    });
    await loading.present();

    try {
      if (this.currentUser) {
        await this.authService.updateUserProfileData(this.currentUser.uid, { age: age }); // Guardar la edad en Firestore
        await loading.dismiss();
        this.router.navigateByUrl('/profile-setup-height'); // Navegar a la siguiente página
      } else {
        await loading.dismiss();
        await this.presentAlert('Error', 'No hay usuario autenticado para guardar la edad.');
      }
    } catch (error: any) {
      await loading.dismiss();
      await this.presentAlert('Error', 'Ocurrió un error al guardar la edad. Intenta de nuevo.');
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