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
  user: {
    photoURL: string | null;
    username: string;
    email: string;
    weight: number;
    age: number;
    height: number;
  } = {
    photoURL: null,
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
      source: CameraSource.Photos,
    });

    if (image.dataUrl !== undefined) {
      this.user.photoURL = image.dataUrl;
    } else {
      console.warn('No se recibió una imagen válida.');
    }
  } catch (error) {
    console.log('Error seleccionando imagen:', error);
  }
}


  getProfileImage(): string {
    return this.user.photoURL || 'assets/images/img_avatar.png';
  }
}
