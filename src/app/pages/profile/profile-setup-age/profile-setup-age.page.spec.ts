import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonInput
} from '@ionic/angular';

@Component({
  selector: 'app-profile-setup-age',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonInput,
  ],
  templateUrl: './profile-setup-age.page.html',
  styleUrls: ['./profile-setup-age.page.scss'],
})
export class ProfileSetupAgePage {
  age: number = 18;

  constructor() {}

  increaseAge() {
    if (this.age < 110) {
      this.age++;
    }
  }

  decreaseAge() {
    if (this.age > 6) {
      this.age--;
    }
  }

  continue() {
    alert(`Edad registrada: ${this.age}`);
  }

  goBack() {
    window.history.back();
  }
}
