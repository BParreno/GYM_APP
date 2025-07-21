// src/app/pages/account-recovery/account-recovery.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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

  async onSendRecoveryLink() { // Renombrado para reflejar que envía un link
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
      message: 'Enviando enlace de recuperación...',
    });
    await loading.present();

    try {
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
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No existe un usuario con este correo electrónico.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico es inválido.';
      }
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