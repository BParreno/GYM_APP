import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss']
})
export class ChangePasswordPage {
  changePasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private toastController: ToastController) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    const { newPassword, confirmPassword } = this.changePasswordForm.value;

    if (newPassword !== confirmPassword) {
      const toast = await this.toastController.create({
        message: 'Las contraseñas no coinciden.',
        color: 'danger',
        duration: 2000,
      });
      toast.present();
      return;
    }

    // Aquí va la lógica real para cambiar la contraseña
    const toast = await this.toastController.create({
      message: 'Contraseña actualizada correctamente.',
      color: 'success',
      duration: 2000,
    });
    toast.present();
  }

  goToHelp() {
    // Redirigir a soporte o ayuda
    console.log('Ir a soporte');
  }
}
