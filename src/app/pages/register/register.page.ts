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
      acceptedPolicy: [false, Validators.requiredTrue]
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  async showPrivacyPolicy() {
    const alert = await this.alertController.create({
      header: 'Política de Privacidad',
      message: 'Aquí van tus políticas o términos. Puedes personalizar este mensaje.',
      buttons: ['Cerrar']
    });
    await alert.present();
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Formulario inválido',
        message: 'Completa todos los campos correctamente.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    const { username, email, password } = this.registerForm.value;
    console.log('Registrando usuario:', { username, email, password });

    this.router.navigate(['/verify-account']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
