// src/app/pages/verify-account/verify-account.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.page.html', // **CORREGIDO: Apunta al HTML correcto**
  styleUrls: ['./verify-account.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VerifyAccountPage implements OnInit { // **CLASE CORREGIDA: VerifyAccountPage**
  userEmail: string | null = null;
  currentUser: User | null = null;
  verificationSent: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['email']) {
        this.userEmail = params['email'];
      }
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && !this.userEmail) {
        this.userEmail = user.email;
      }
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    if (this.currentUser && !this.verificationSent && !this.currentUser.emailVerified) {
       await this.sendVerificationEmail();
    }
  }

  async sendVerificationEmail() {
    if (!this.currentUser) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No hay un usuario autenticado para enviar el correo de verificación.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Enviando correo de verificación...',
    });
    await loading.present();

    try {
      await this.authService.sendVerificationEmail(this.currentUser);
      this.verificationSent = true;
      const alert = await this.alertController.create({
        header: 'Correo Enviado',
        message: `Se ha enviado un correo de verificación a ${this.userEmail}. Por favor, revisa tu bandeja de entrada y spam.`,
        buttons: ['Ok']
      });
      await alert.present();
    } catch (error: any) {
      let errorMessage = 'Error al enviar el correo de verificación.';
      console.error('Error sending verification email:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: errorMessage,
        buttons: ['Ok']
      });
      await alert.present();
    } finally {
      await loading.dismiss();
    }
  }

  async checkVerificationStatus() {
    if (!this.currentUser) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No hay un usuario autenticado para verificar.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Verificando estado...',
    });
    await loading.present();

    try {
      await this.currentUser.reload();
      if (this.currentUser.emailVerified) {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Verificación Exitosa',
          message: 'Tu cuenta ha sido verificada correctamente.',
          buttons: ['Continuar']
        });
        await alert.present();
        this.router.navigate(['/profile-setup-age']);
      } else {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'No Verificado',
          message: 'Tu correo aún no ha sido verificado. Por favor, revisa tu bandeja de entrada o intenta reenviar el correo.',
          buttons: ['Ok']
        });
        await alert.present();
      }
    } catch (error: any) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo verificar el estado del correo. Intenta de nuevo.',
        buttons: ['Ok']
      });
      await alert.present();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}