// src/app/pages/role-selection/role-selection.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.page.html',
  styleUrls: ['./role-selection.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RoleSelectionPage implements OnInit {
  selectedRole: 'Principiante' | 'Avanzado' | null = null; // Tipado para roles permitidos
  currentUser: User | null = null;
  userRole: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigateByUrl('/login');
      } else {
        this.authService.getUserData(user.uid).then(userData => {
          this.userRole = userData?.role;
          if (this.userRole === 'Entrenador') {
              this.router.navigateByUrl('/all-routines'); // Entrenador no debería llegar aquí
          } else if (this.userRole) {
            // Si ya tiene un rol de usuario normal, precargarlo
            this.selectedRole = this.userRole as 'Principiante' | 'Avanzado';
          }
        });
      }
    });
  }

  async selectRole(role: 'Principiante' | 'Avanzado') {
    this.selectedRole = role;
    const loading = await this.loadingController.create({
      message: 'Guardando rol...',
    });
    await loading.present();

    try {
      if (this.currentUser && this.selectedRole) {
        await this.authService.updateUserProfileData(this.currentUser.uid, { role: this.selectedRole });
        // Marcar el perfil como COMPLETO (último paso para Principiante/Avanzado)
        await this.authService.markProfileAsCompleted(this.currentUser.uid);

        await loading.dismiss();
        await this.presentAlert('¡Cuenta Creada Correctamente!', 'Tu perfil ha sido configurado y tu cuenta está lista.');
        this.router.navigateByUrl('/login'); // Redirigir al login
      } else {
        await loading.dismiss();
        await this.presentAlert('Error', 'No se pudo guardar el rol. Por favor, intenta de nuevo.');
      }
    } catch (error: any) {
      await loading.dismiss();
      await this.presentAlert('Error', 'Ocurrió un error al guardar el rol. Intenta de nuevo.');
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