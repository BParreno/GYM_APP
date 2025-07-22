// src/app/pages/verify-account/verify-account.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router'; // Eliminado RouterLink si no se usa en el template
import { AuthService } from 'src/app/services/auth.service';
import { User } from '@angular/fire/auth'; // Importar User de Firebase Auth

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.page.html',
  styleUrls: ['./verify-account.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule] // Eliminado RouterLink de imports si no se usa
})
export class VerifyAccountPage implements OnInit {
  userEmail: string | null = null;
  currentUser: User | null = null; // Mantener para el ngOnInit

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    // Obtener el email de los queryParams (desde register)
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['email']) {
        this.userEmail = params['email'];
      }
    });

    // Suscribirse a currentUser$ para obtener el usuario autenticado
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && !this.userEmail) { // Si no hay email en queryParams, usar el del usuario actual
        this.userEmail = user.email;
      }
      // Si el usuario ya está verificado, redirigir inmediatamente
      if (user && user.emailVerified) {
        this.redirectToCorrectPage(user.uid);
      }
    });

    // Pequeña espera para asegurar que currentUser se haya establecido antes de intentar reenviar
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async onResendVerificationEmail() { // Renombrado para coincidir con el HTML
    const loading = await this.loadingController.create({
      message: 'Enviando correo de verificación...',
    });
    await loading.present();

    try {
      await this.authService.sendEmailVerification(); // Llama al método corregido en AuthService
      await loading.dismiss();
      await this.presentAlert('Correo Enviado', 'Se ha enviado un nuevo correo de verificación. Revisa tu bandeja de entrada y spam.');
    } catch (error) {
      await loading.dismiss();
      console.error('Error al reenviar correo de verificación:', error);
      await this.presentAlert('Error', 'Hubo un problema al reenviar el correo. Por favor, intenta de nuevo.');
    }
  }

  async onCheckVerificationStatus() { // Renombrado para coincidir con el HTML
    const loading = await this.loadingController.create({
      message: 'Verificando cuenta...',
    });
    await loading.present();

    try {
      await this.authService.reloadCurrentUser(); // Recargar el usuario de Firebase Auth
      const user = await this.authService.getCurrentUser(); // Obtener el usuario actualizado

      if (user && user.emailVerified) {
        const uid = user.uid;
        const userData = await this.authService.getUserData(uid);

        if (userData) {
          if (userData.role === 'Entrenador') {
            // Entrenador: marcar profileCompleted como true si no lo está
            if (!userData.profileCompleted) {
              await this.authService.updateUserProfileData(uid, { profileCompleted: true }); // Usar updateUserProfileData
              await this.presentAlert('Cuenta verificada', 'Tu cuenta de entrenador ha sido verificada. Por favor, inicia sesión.');
            } else {
              await this.presentAlert('Cuenta verificada', 'Tu cuenta ya estaba verificada y completa. Por favor, inicia sesión.');
            }
            // IMPORTANTE: CERRAR SESIÓN ANTES DE REDIRIGIR AL LOGIN
            await this.authService.logout();
            this.router.navigateByUrl('/login');

          } else {
            // Principiante/Avanzado: Redirigir al flujo de configuración de perfil si no está completo
            if (!userData.profileCompleted) {
              await this.presentAlert('Cuenta verificada', 'Tu cuenta ha sido verificada. Continúa con la configuración de tu perfil.');
              this.router.navigateByUrl('/profile-setup-gender'); // Redirigir a la primera página de configuración
            } else {
              // Si ya está completo (lo cual no debería ser el caso si recién verifica),
              // lo enviamos al login y forzamos el logout por si acaso.
              await this.presentAlert('Cuenta verificada', 'Tu cuenta ya estaba verificada y completa. Por favor, inicia sesión.');
              // IMPORTANTE: CERRAR SESIÓN ANTES DE REDIRIGIR AL LOGIN
              await this.authService.logout();
              this.router.navigateByUrl('/login');
            }
          }
        } else {
          // Si no se encontraron datos de perfil (escenario inesperado), ir a login después de cerrar sesión
          await this.presentAlert('Cuenta verificada', 'Tu cuenta ha sido verificada. Por favor, inicia sesión.');
          // IMPORTANTE: CERRAR SESIÓN ANTES DE REDIRIGIR AL LOGIN
          await this.authService.logout();
          this.router.navigateByUrl('/login');
        }
      } else {
        await this.presentAlert('Aún no verificado', 'Tu correo aún no ha sido verificado. Por favor, revisa tu bandeja de entrada o intenta reenviar el correo.');
      }
    } catch (error) {
      console.error('Error al verificar cuenta:', error);
      await this.presentAlert('Error', 'Hubo un problema al verificar tu cuenta. Por favor, intenta de nuevo.');
    } finally {
      await loading.dismiss();
    }
  }

  private async redirectToCorrectPage(uid: string) {
    const userData = await this.authService.getUserData(uid);

    if (userData && userData.role === 'Entrenador') {
      this.router.navigateByUrl('/login'); // Entrenadores verificados van al login
    } else if (userData && userData.profileCompleted) {
      switch (userData.role) {
        case 'Principiante':
          this.router.navigateByUrl('/view-my-routine');
          break;
        case 'Avanzado':
          this.router.navigateByUrl('/select-routine');
          break;
        default:
          this.router.navigateByUrl('/login');
          break;
      }
    } else {
      this.router.navigateByUrl('/profile-setup-gender');
    }
  }

  goToLogin() { // Método para el botón "Volver al inicio de sesión"
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