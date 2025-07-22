import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { Auth, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  user = {
    photoURL: null as string | null,
    username: '',
    email: '',
    weight: 0,
    age: 0,
    height: 0
  };

  private userAuth: User | null = null;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.initUserData();
  }

  private initUserData() {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        this.userAuth = user;

        this.user.username = user.displayName || 'Sin nombre';
        this.user.email = user.email || 'Sin correo';
        this.user.photoURL = user.photoURL || null;

        await this.loadAdditionalUserData(user.uid);
      } else {
        this.userAuth = null;
      }
    });
  }

  private async loadAdditionalUserData(uid: string) {
    const docRef = doc(this.firestore, `users/${uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      this.user.weight = data.weight || 0;
      this.user.age = data.age || 0;
      this.user.height = data.height || 0;
    }
  }

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

      // Aquí podrías actualizar en Firebase si deseas persistir el cambio
    } catch (error) {
      console.log('Error seleccionando imagen:', error);
    }
  }

  getProfileImage(): string {
    return this.user.photoURL || 'assets/images/img_avatar.png';
  }
}
