import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  user = {
    photoURL: 'https://via.placeholder.com/150',
    username: 'Mary Sunderland',
    email: 'mary2001@example.com',
    weight: 75,
    age: 28,
    height: 165
  };

  async changeProfilePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos, // 📂 Selecciona desde la galería
      });

      this.user.photoURL = image.dataUrl!;
    } catch (error) {
      console.log('Error seleccionando imagen:', error);
    }
  }
}
