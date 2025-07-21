// src/app/pages/profile/profile-setup-weight/profile-setup-weight.page.ts
import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile-setup-weight',
  templateUrl: './profile-setup-weight.page.html',
  styleUrls: ['./profile-setup-weight.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class ProfileSetupWeightPage implements OnInit {
  weightForm: FormGroup;
  currentUser: User | null = null;
  unit: 'kg' | 'lb' = 'kg';
  weights: number[] = []; // Para el rango de pesos

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private firestore: Firestore
  ) {
    this.weightForm = this.fb.group({
      weight: ['', [Validators.required, Validators.min(20), Validators.max(300), Validators.pattern('^[0-9]*$')]] // Peso en kg
    });
    this.generateWeights();
  }

  async ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigateByUrl('/login');
      } else {
        this.loadExistingWeight(user.uid);
      }
    });
  }

  generateWeights() {
    for (let i = 30; i <= 200; i++) {
      this.weights.push(i);
    }
  }

  async loadExistingWeight(uid: string) {
    const userData = await this.authService.getUserData(uid);
    if (userData && userData.weight) {
      this.weightForm.get('weight')?.setValue(userData.weight);
      this.unit = userData.weightUnit || 'kg'; // Cargar unidad si existe
    }
  }

  async onNext() {
    if (this.weightForm.invalid) {
      await this.presentAlert('Peso Inválido', 'Por favor, introduce un peso válido (entre 20 y 300 kg).');
      return;
    }

    const { weight } = this.weightForm.value;

    const loading = await this.loadingController.create({
      message: 'Guardando peso...',
    });
    await loading.present();

    try {
      if (this.currentUser) {
        await this.authService.updateUserProfileData(this.currentUser.uid, { weight: weight, weightUnit: this.unit });
        await loading.dismiss();
        this.router.navigateByUrl('/objective-selection'); // Navegar a la selección de objetivo (NUEVO ORDEN)
      } else {
        await loading.dismiss();
        await this.presentAlert('Error', 'No hay usuario autenticado para guardar el peso.');
      }
    } catch (error: any) {
      await loading.dismiss();
      await this.presentAlert('Error', 'Ocurrió un error al guardar el peso. Intenta de nuevo.');
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