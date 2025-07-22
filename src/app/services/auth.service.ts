// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, User, updateProfile, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: Observable<User | null>;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.currentUser$ = new Observable(observer => {
      onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
    });
  }

  async register(email: string, password: string, fullName: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: fullName });
      // Crear datos de usuario en Firestore, marcando profileCompleted como false inicialmente
      await this.createUserData(userCredential.user.uid, email, fullName, null, false);
      return userCredential;
    }
    throw new Error('User creation failed.');
  }

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    const user = this.auth.currentUser;
    if (user) {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists() && !docSnap.data()['profileCompleted']) {
        // Si el perfil no está completo, eliminar los datos de Firestore
        await this.deleteUserData(user.uid);
        console.log('Perfil incompleto eliminado de Firestore al cerrar sesión.');
      }
    }
    await signOut(this.auth); // Cerrar sesión de Firebase Auth
  }

  // Método para obtener el usuario actual de forma asíncrona
  async getCurrentUser(): Promise<User | null> {
    return this.auth.currentUser;
  }

  // Método para recargar el usuario actual de Firebase Auth
  async reloadCurrentUser(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      await user.reload();
    }
  }

  async sendEmailVerification() { // Renombrado a sendEmailVerification sin parámetro de usuario
    const user = this.auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
    } else {
      throw new Error('No authenticated user to send verification email.');
    }
  }

  async sendPasswordResetEmail(email: string) {
    await sendPasswordResetEmail(this.auth, email);
  }

  async changePassword(newPassword: string) {
    const user = this.auth.currentUser;
    if (user) {
      return from((user as any).updatePassword(newPassword));
    } else {
      throw new Error('No authenticated user found.');
    }
  }

  // Métodos de Firestore para datos de usuario y roles
  private async createUserData(uid: string, email: string, fullName: string, initialRole: string | null = null, profileCompleted: boolean = false) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userDocRef, {
      uid: uid,
      email: email,
      fullName: fullName,
      role: initialRole,
      profileCompleted: profileCompleted, // Nuevo campo para controlar el estado del perfil
      createdAt: new Date()
    }, { merge: true });
  }

  async assignInitialRole(uid: string, role: string | null) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userDocRef, { role: role }, { merge: true });
  }

  async updateUserProfileData(uid: string, data: any) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(userDocRef, data);
  }

  async markProfileAsCompleted(uid: string) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(userDocRef, { profileCompleted: true });
  }

  async deleteUserData(uid: string) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await deleteDoc(userDocRef);
  }

  async getUserData(uid: string): Promise<any | null> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  }
}