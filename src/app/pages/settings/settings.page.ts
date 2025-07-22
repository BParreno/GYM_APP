import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  user = {
    photoURL: '',
    username: '',
    gender: '',
    age: null,
    height: null,
    weight: null,
    visibility: {
      photo: true,
      username: true,
      gender: true,
      age: true,
      height: true,
      weight: true
    }
  };

  visibilityKeys: (keyof typeof this.user.visibility)[] = [];

  constructor() {
    this.visibilityKeys = Object.keys(this.user.visibility) as (keyof typeof this.user.visibility)[];
  }

  async updateProfile() {
    console.log('Actualizar usuario', this.user);
    // Aquí se integrará firestore.update(user)
  }
}
