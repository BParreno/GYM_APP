// src/app/pages/objective-selection/objective-selection.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-objective-selection',
  templateUrl: './objective-selection.page.html',
  styleUrls: ['./objective-selection.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ObjectiveSelectionPage implements OnInit {
  availableObjectives: string[] = [
    'Ganar Masa Muscular',
    'Perder Peso',
    'Mejorar Resistencia',
    'Mantenerse en Forma',
    'Otros'
  ];
  selectedObjective: string | null = null; // Cambiado a selección única
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigateByUrl('/login');
      } else {
        // Cargar objetivo existente
        this.authService.getUserData(user.uid).then(userData => {
          if (userData && userData.objective) {
            this.selectedObjective = userData.objective;
          }
        });
      }
    });
  }

  async selectObjective(objective: string) {
    this.selectedObjective = objective; // Almacena el objetivo seleccionado

    const loading = await this.loadingController.create({
      message: 'Guardando objetivo...',
    });
    await loading.present();

    try {
      if (this.currentUser && this.selectedObjective) {
        await this.authService.updateUserProfileData(this.currentUser.uid, { objective: this.selectedObjective });
        
        await loading.dismiss();
        await this.presentAlert('Objetivo Guardado', `Tu objetivo "${this.selectedObjective}" ha sido guardado.`);
        this.router.navigateByUrl('/role-selection'); // Navegar a la selección de rol (SIGUIENTE PASO)
      } else {
        await loading.dismiss();
        await this.presentAlert('Error', 'No se pudo guardar el objetivo. Por favor, intenta de nuevo.');
      }
    } catch (error: any) {
      await loading.dismiss();
      await this.presentAlert('Error', 'Ocurrió un error al guardar el objetivo. Intenta de nuevo.');
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