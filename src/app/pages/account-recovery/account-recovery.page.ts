// src/app/pages/account-recovery/account-recovery.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
// No es necesario importar AuthErrorCodes si usamos las cadenas literales para los códigos de error
// import { AuthErrorCodes } from '@angular/fire/auth';

@Component({
  selector: 'app-account-recovery',
  templateUrl: './account-recovery.page.html',
  styleUrls: ['./account-recovery.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AccountRecoveryPage implements OnInit {
  recoveryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    // No se necesita ActivatedRoute aquí a menos que se espere un email por queryParams
  }

  async onSendRecoveryLink() {
    if (this.recoveryForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Correo Inválido',
        message: 'Por favor, introduce un correo electrónico válido.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    const { email } = this.recoveryForm.value;

    const loading = await this.loadingController.create({
      message: 'Verificando correo y enviando enlace...',
    });
    await loading.present();

    try {
      // Paso 1: Intentar un login con una contraseña ficticia para detectar 'auth/user-not-found'
      // Esto es un intento de verificar la existencia del usuario en el cliente.
      try {
        await this.authService.login(email, 'fictitious-password-to-check-existence');
        // Si el login tiene éxito (lo cual es muy raro con una contraseña ficticia),
        // o si lanza un error diferente a 'auth/user-not-found',
        // asumimos que el usuario podría existir y procedemos.
      } catch (checkError: any) {
        // CORREGIDO: Usar la cadena literal 'auth/user-not-found'
        if (checkError.code === 'auth/user-not-found') {
          await loading.dismiss();
          const notFoundAlert = await this.alertController.create({
            header: 'Correo No Encontrado',
            message: 'No existe una cuenta registrada con este correo electrónico. Por favor, verifica el correo ingresado.',
            buttons: ['Ok']
          });
          await notFoundAlert.present();
          return; // Detener el proceso si el usuario no existe
        }
        // Si es otro error (ej. 'auth/wrong-password'), significa que el correo existe,
        // y el error de contraseña incorrecta es lo que esperamos. Continuamos.
      }

      // Si el correo existe (o no se pudo determinar que no existe con el intento de login),
      // procedemos a enviar el enlace de restablecimiento de contraseña de Firebase.
      await this.authService.sendPasswordResetEmail(email);
      await loading.dismiss();

      const successAlert = await this.alertController.create({
        header: 'Correo Enviado',
        message: `Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña a ${email}. Por favor, revisa tu bandeja de entrada y spam.`,
        buttons: ['Ok']
      });
      await successAlert.present();

      // Después de enviar el enlace, el usuario debe ir al login para intentar iniciar sesión con la nueva contraseña
      this.router.navigate(['/login']);

    } catch (error: any) {
      await loading.dismiss();
      let errorMessage = 'Error al enviar el correo de recuperación. Por favor, intenta de nuevo.';
      // CORREGIDO: Usar la cadena literal 'auth/invalid-email'
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico es inválido.';
      }
      // Para otros errores inesperados de sendPasswordResetEmail (ej. problemas de red)
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: errorMessage,
        buttons: ['Ok']
      });
      await errorAlert.present();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}