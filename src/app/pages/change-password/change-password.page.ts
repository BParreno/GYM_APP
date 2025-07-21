import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router'; // Importar Router

// Validador personalizado para verificar que las contraseñas coincidan
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
    return { 'passwordMismatch': true };
  }
  return null;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss']
})
export class ChangePasswordPage {
  changePasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastController: ToastController,
    private router: Router // Inyectar Router
  ) {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: passwordMatchValidator }); // Añadir el validador a nivel de FormGroup
  }

  async onSubmit() {
    // Si el formulario no es válido (ej. contraseñas no coinciden o campos vacíos), no hacer nada
    if (this.changePasswordForm.invalid) {
      // Opcional: mostrar un toast si el botón se pudiera presionar aun siendo inválido por alguna razón
      const toast = await this.toastController.create({
        message: 'Por favor, asegúrate de que todos los campos sean válidos y las contraseñas coincidan.',
        color: 'danger',
        duration: 2000,
      });
      toast.present();
      return;
    }

    // Aquí va la lógica real para cambiar la contraseña
    // En un escenario real, aquí llamarías a un servicio de autenticación
    console.log('Contraseña cambiada con éxito. Redirigiendo a login...');

    const toast = await this.toastController.create({
      message: 'Contraseña actualizada correctamente.',
      color: 'success',
      duration: 2000,
    });
    await toast.present(); // Usar await para esperar que el toast se muestre

    // Redirigir a la página de login
    this.router.navigateByUrl('/login'); // Ajusta '/login' a la ruta de tu página de login
  }

  // Opcional: para mostrar mensajes de error específicos en el HTML
  get newPasswordControl() {
    return this.changePasswordForm.get('newPassword');
  }

  get confirmPasswordControl() {
    return this.changePasswordForm.get('confirmPassword');
  }
}