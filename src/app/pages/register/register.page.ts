// src/app/pages/register/register.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

// Custom validator to check if passwords match
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.root.get('password');
    const confirmPassword = control.root.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    } else if (confirmPassword && confirmPassword.hasError('mismatch')) {
      // If they now match, remove the error
      confirmPassword.setErrors(null);
    }
    return null;
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  private readonly TRAINER_CODE = '1964'; // Code for trainer role

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptPolicies: [false, Validators.requiredTrue] // Nuevo campo para las políticas
    }, { validators: passwordMatchValidator() });
  }

  ngOnInit() {
    // Re-check password match on value changes
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.registerForm.get('password')?.updateValueAndValidity();
    });
  }

  async onRegister(isTrainer: boolean = false) {
    if (this.registerForm.invalid) {
      await this.presentAlert('Formulario Inválido', 'Por favor, completa todos los campos correctamente y acepta las políticas de privacidad.');
      return;
    }

    const { email, password, fullName } = this.registerForm.value;

    const loading = await this.loadingController.create({
      message: 'Registrando usuario...',
    });
    await loading.present();

    try {
      const userCredential = await this.authService.register(email, password, fullName);
      await loading.dismiss();

      if (userCredential.user) {
        // Enviar email de verificación de Firebase
        // CORREGIDO: Llamar a sendEmailVerification sin el parámetro user
        await this.authService.sendEmailVerification();

        // Asignar rol inicial en Firestore (solo para entrenadores aquí)
        if (isTrainer) {
          await this.authService.assignInitialRole(userCredential.user.uid, 'Entrenador');
          // Para entrenadores, el perfil se marca como completo después de la verificación del email
          // Esto se gestionará en verify-account.page.ts
        }

        await this.presentAlert('Registro Exitoso', 'Tu cuenta ha sido creada. Por favor, verifica tu correo electrónico para continuar.');
        // Redirigir a la página de verificación de cuenta
        this.router.navigate(['/verify-account'], { queryParams: { email: email } });
      }

    } catch (error: any) {
      await loading.dismiss();
      let errorMessage = 'Error al registrar el usuario. Por favor, intenta de nuevo.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'El correo electrónico ya está en uso.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil.';
      }
      await this.presentAlert('Error de Registro', errorMessage);
    }
  }

  async presentTrainerCodePrompt() {
    const alert = await this.alertController.create({
      header: 'Código de Entrenador',
      inputs: [
        {
          name: 'trainerCode',
          type: 'password',
          placeholder: 'Ingresa el código'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: async (data) => {
            if (data.trainerCode === this.TRAINER_CODE) {
              // Si el código es correcto, registrar como entrenador
              await this.onRegister(true);
            } else {
              await this.presentAlert('Código Incorrecto', 'El código de entrenador es incorrecto.');
            }
          }
        }
      ]
    });
    await alert.present();
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