// src/app/pages/register/register.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { IonicModule, AlertController, LoadingController, ModalController } from '@ionic/angular'; // Importar ModalController
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PrivacyPolicyModalComponent } from 'src/app/components/privacy-policy-modal/privacy-policy-modal.component'; // Importar el componente del modal

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
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  private readonly TRAINER_CODE = '1964'; // Code for trainer role

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController // Inyectar ModalController
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptPolicies: [false, Validators.requiredTrue]
    }, { validators: passwordMatchValidator() });
  }

  ngOnInit() {
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
        await this.authService.sendEmailVerification();

        if (isTrainer) {
          await this.authService.assignInitialRole(userCredential.user.uid, 'Entrenador');
        }

        await this.presentAlert('Registro Exitoso', 'Tu cuenta ha sido creada. Por favor, verifica tu correo electrónico para continuar.');
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

  // Contenido HTML de las políticas de privacidad como una cadena de texto
  private privacyPolicyHtmlContent: string = `
    <p><strong>Fecha de entrada en vigor: 22 de julio de 2025</strong></p>
    <p>En nuestra aplicación de gimnasio, valoramos y respetamos tu privacidad. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos la información que proporcionas al utilizar nuestra aplicación móvil.</p>

    <h3>1. Información que recopilamos</h3>
    <p>La información personal que recopilamos incluye tu dirección de correo electrónico, nombre completo, sexo, edad, estatura, peso y objetivos de entrenamiento. Esta información es solicitada al momento de registrarte o configurar tu perfil en nuestra aplicación.</p>

    <h3>2. Uso de la información</h3>
    <p>Utilizamos tu información personal únicamente para los siguientes fines:</p>
    <ul>
      <li>Creación y autenticación de tu cuenta.</li>
      <li>Personalización de tu experiencia de entrenamiento y asignación de rutinas.</li>
      <li>Envío de notificaciones relacionadas con la app (opcional, según tus preferencias).</li>
      <li>Mejorar la experiencia del usuario en la aplicación y ofrecerte un servicio más relevante.</li>
    </ul>
    <p>No compartimos tu información personal con terceros para fines publicitarios.</p>

    <h3>3. Almacenamiento y seguridad</h3>
    <p>Tu información personal se almacena de forma segura utilizando métodos de protección estándar de la industria para evitar accesos no autorizados, pérdidas o filtraciones de datos.</p>

    <h3>4. Derechos del usuario</h3>
    <p>Tienes derecho a:</p>
    <ul>
      <li>Acceder a la información que hemos recopilado sobre ti.</li>
      <li>Solicitar la corrección o actualización de tus datos.</li>
      <li>Solicitar la eliminación de tu cuenta y toda tu información asociada.</li>
      <li>Revocar tu consentimiento en cualquier momento.</li>
    </ul>
    <p>Puedes ejercer estos derechos contactándonos a: biparreno@sudamericano.edu.ec</p>

    <h3>5. Cambios en la política</h3>
    <p>Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Te notificaremos sobre cualquier cambio publicando la nueva versión en esta misma aplicación o por correo electrónico.</p>

    <h3>6. Contacto</h3>
    <p>Si tienes preguntas o inquietudes sobre esta política, puedes contactarnos a: biparreno@sudamericano.edu.ec</p>
  `;

  // Método para mostrar las políticas de privacidad como un modal
  async presentPrivacyPolicy() {
    const modal = await this.modalController.create({
      component: PrivacyPolicyModalComponent,
      // Pasamos el contenido HTML como una propiedad al componente del modal
      componentProps: {
        policyContentHtml: this.privacyPolicyHtmlContent
      },
      cssClass: 'my-custom-modal-class' // Opcional: para estilos personalizados del modal
    });
    await modal.present();
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