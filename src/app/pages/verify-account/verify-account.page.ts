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
  templateUrl: './verify-account.page.html',
  styleUrls: ['./verify-account.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VerifyAccountPage implements OnInit {
  userEmail: string | null = null;
  currentUser: User | null = null;

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
      // Si el usuario ya está verificado, redirigir inmediatamente
      if (user && user.emailVerified) {
        this.redirectToCorrectPage(user.uid);
      }
    });

    await new Promise(resolve => setTimeout(resolve, 100)); // Pequeña espera
  }

  async sendVerificationEmail() {
    if (!this.currentUser) {
      await this.presentAlert('Error', 'No hay un usuario autenticado para enviar el correo de verificación.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Reenviando correo de verificación...',
    });
    await loading.present();

    try {
      await this.authService.sendVerificationEmail(this.currentUser);
      await loading.dismiss();
      await this.presentAlert('Correo Reenviado', `Se ha reenviado un correo de verificación a ${this.userEmail}. Por favor, revisa tu bandeja de entrada y spam.`);
    } catch (error: any) {
      await loading.dismiss();
      console.error('Error sending verification email:', error);
      await this.presentAlert('Error', 'Error al reenviar el correo de verificación.');
    }
  }

  async checkVerificationStatus() {
    if (!this.currentUser) {
      await this.presentAlert('Error', 'No hay un usuario autenticado para verificar.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Verificando estado...',
    });
    await loading.present();

    try {
      await this.currentUser.reload(); // Recargar el usuario para obtener el estado más reciente
      if (this.currentUser.emailVerified) {
        await loading.dismiss();
        await this.presentAlert('Verificación Exitosa', 'Tu cuenta ha sido verificada correctamente.');
        // Para entrenadores, marcar perfil como completo aquí
        const userData = await this.authService.getUserData(this.currentUser.uid);
        if (userData && userData.role === 'Entrenador') {
          await this.authService.markProfileAsCompleted(this.currentUser.uid);
        }
        await this.redirectToCorrectPage(this.currentUser.uid);
      } else {
        await loading.dismiss();
        await this.presentAlert('No Verificado', 'Tu correo aún no ha sido verificado. Por favor, revisa tu bandeja de entrada o intenta reenviar el correo.');
      }
    } catch (error: any) {
      await loading.dismiss();
      await this.presentAlert('Error', 'No se pudo verificar el estado del correo. Intenta de nuevo.');
    }
  }

  private async redirectToCorrectPage(uid: string) {
    const userData = await this.authService.getUserData(uid);

    if (userData && userData.role === 'Entrenador') {
      // Entrenadores, si su email está verificado, se considera su perfil completo y van al login
      this.router.navigateByUrl('/login');
    } else if (userData && userData.profileCompleted) {
      // Si el perfil ya está completo (Principiante/Avanzado que ya terminó el flujo)
      switch (userData.role) {
        case 'Principiante':
          this.router.navigateByUrl('/view-my-routine'); // Página de inicio para Principiantes
          break;
        case 'Avanzado': // 'Intermedio' ahora es 'Avanzado'
          this.router.navigateByUrl('/select-routine'); // Página de inicio para Avanzados
          break;
        default:
          this.router.navigateByUrl('/login'); // Fallback
          break;
      }
    } else {
      // Si el perfil no está completo (Principiante/Avanzado nuevo), redirigir a profile-setup-gender
      this.router.navigateByUrl('/profile-setup-gender');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
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