import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;
  acceptedPolicy = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  async showPrivacyPolicy() {
    const alert = await this.alertController.create({
      header: 'Políticas y Términos',
      message: `
        Somos increibles
      `,
      buttons: ['Cerrar']
    });

    await alert.present();
  }

  async onRegister() {
    if (!this.acceptedPolicy) {
      const alert = await this.alertController.create({
        header: 'Advertencia',
        message: 'Debes aceptar las políticas de privacidad para continuar.',
        buttons: ['Entendido'],
      });
      await alert.present();
      return;
    }

    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      console.log('Registrando usuario:', { username, email, password });

      // Aquí iría la lógica real para crear el usuario con Firebase u otro backend

      this.router.navigate(['/verify-account']);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
