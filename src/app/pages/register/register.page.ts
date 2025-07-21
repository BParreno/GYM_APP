// src/app/pages/register/register.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular'; // Importa LoadingController
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; // Importa tu AuthService

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController, // Inyecta LoadingController
    private authService: AuthService // Inyecta tu AuthService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]], // Validators.email ya valida el formato con '@'
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptedPolicy: [false, Validators.requiredTrue] // La política debe ser aceptada
    }, { validators: this.passwordsMatchValidator }); // Usa el validador personalizado
  }

  // Validador personalizado para la coincidencia de contraseñas
  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true }; // Devuelve un error si no coinciden
    }
    return null; // Devuelve null si coinciden
  }

  async showPrivacyPolicy() {
    const alert = await this.alertController.create({
      header: 'Política de Privacidad',
      message: 'Aquí van tus políticas o términos. Puedes personalizar este mensaje.', // Esto sigue siendo un placeholder
      buttons: ['Cerrar']
    });
    await alert.present();
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Formulario inválido',
        message: 'Por favor, completa todos los campos correctamente, incluyendo la aceptación de la política de privacidad, y asegúrate de que las contraseñas coincidan y el email sea válido.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    const { email, password, username } = this.registerForm.value; // Puedes usar el username para el perfil inicial

    const loading = await this.loadingController.create({
      message: 'Registrando usuario...',
    });
    await loading.present();

    try {
      // Por ahora, asignamos un rol predeterminado. Luego esto puede ser dinámico.
      const defaultRole = 'principiante'; // O 'intermedio', 'entrenador' según tu lógica
      const user = await this.authService.registerUser(email, password, defaultRole);

      // Si el registro es exitoso y el usuario existe
      if (user) {
        // Opcional: Enviar correo de verificación inmediatamente después del registro
        await this.authService.sendVerificationEmail(user);

        await loading.dismiss(); // Cierra el spinner de carga

        const successAlert = await this.alertController.create({
          header: 'Registro Exitoso',
          message: 'Tu cuenta ha sido creada. Se ha enviado un correo de verificación. Por favor, verifica tu email.',
          buttons: ['Ok']
        });
        await successAlert.present();

        // Navegar a la página de verificación de cuenta
        this.router.navigate(['/verify-account'], { queryParams: { email: email } }); // Pasa el email como queryParam
      }
    } catch (error: any) {
      await loading.dismiss(); // Cierra el spinner en caso de error

      let errorMessage = 'Ha ocurrido un error durante el registro. Inténtalo de nuevo.';
      // Manejo de errores específicos de Firebase
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'El correo electrónico ya está registrado. Por favor, usa otro o inicia sesión.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El formato del correo electrónico es inválido.';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es demasiado débil. Necesita al menos 6 caracteres.';
          break;
        // Puedes añadir más casos de error según necesites
      }

      const errorAlert = await this.alertController.create({
        header: 'Error de Registro',
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