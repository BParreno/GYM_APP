// src/app/pages/login/login.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // ELIMINADO: La redirección automática si ya hay un usuario logueado.
    // La página de login ahora siempre se mostrará primero.
    // La redirección ocurrirá solo después de un login exitoso (en onLogin)
    // o después de un registro/verificación (desde verify-account).
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Credenciales Inválidas',
        message: 'Por favor, introduce un correo y contraseña válidos.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    const { email, password } = this.loginForm.value;

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    try {
      const userCredential = await this.authService.login(email, password);
      await loading.dismiss();

      if (userCredential.user) {
        // Recargar el usuario para obtener el estado de verificación más reciente
        await userCredential.user.reload();

        if (!userCredential.user.emailVerified) {
          // Si el correo no está verificado, redirigir a la página de verificación
          await this.presentAlert('Verificación Requerida', 'Por favor, verifica tu correo electrónico para continuar.');
          this.router.navigate(['/verify-account'], { queryParams: { email: email } });
        } else {
          // Si el correo está verificado, redirigir según el rol y el estado del perfil
          await this.redirectToCorrectPage(userCredential.user.uid);
        }
      }

    } catch (error: any) {
      await loading.dismiss();
      let errorMessage = 'Error al iniciar sesión. Por favor, intenta de nuevo.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Correo o contraseña incorrectos.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico es inválido.';
      }
      const alert = await this.alertController.create({
        header: 'Error de Inicio de Sesión',
        message: errorMessage,
        buttons: ['Ok']
      });
      await alert.present();
    }
  }

  private async redirectToCorrectPage(uid: string) {
    const userData = await this.authService.getUserData(uid);

    if (userData && userData.role === 'Entrenador') {
      // Entrenadores, si su perfil está completo, van a all-routines
      if (userData.profileCompleted) {
        this.router.navigateByUrl('/all-routines');
      } else {
        // Si un entrenador no tiene el perfil completo después de verificar email,
        // (lo cual se marca en verify-account.page.ts), lo enviamos a login.
        // Esto es un fallback, el flujo ideal es que ya estaría completo.
        this.router.navigateByUrl('/login');
      }
    } else if (userData && userData.profileCompleted) {
      // Principiantes/Avanzados con perfil completo
      switch (userData.role) {
        case 'Principiante':
          this.router.navigateByUrl('/view-my-routine');
          break;
        case 'Avanzado':
          this.router.navigateByUrl('/select-routine');
          break;
        default:
          this.router.navigateByUrl('/login'); // Fallback si el rol es desconocido pero el perfil está completo
          break;
      }
    } else {
      // Perfil no completo (Principiante/Avanzado) o sin rol asignado aún
      this.router.navigateByUrl('/profile-setup-gender'); // Redirigir a la primera página de configuración de perfil
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