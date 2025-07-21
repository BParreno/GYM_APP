// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser$: Observable<User | null>; // Observable para el estado de autenticación

  constructor(
    private auth: Auth, // Inyecta la instancia de Auth de @angular/fire
    private firestore: Firestore // Inyecta la instancia de Firestore de @angular/fire
  ) {
    // Escucha cambios en el estado de autenticación
    this.currentUser$ = new Observable(observer => {
      onAuthStateChanged(this.auth, (user: User | null) => {
        observer.next(user);
      });
    });
  }

  /**
   * Registra un nuevo usuario con email y contraseña, y guarda su rol inicial en Firestore.
   * @param email Email del usuario.
   * @param password Contraseña del usuario.
   * @param role Rol del usuario (principiante, intermedio, entrenador).
   * @returns Una Promesa que resuelve con el objeto User de Firebase.
   */
  async registerUser(email: string, password: string, role: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Guardar el rol y otros datos iniciales en Firestore
      if (user) {
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        await setDoc(userDocRef, {
          email: user.email,
          role: role, // Almacena el rol seleccionado
          createdAt: new Date(),
          age: null,
          height: null,
          weight: null,
          objectives: []
        });
        return user;
      } else {
        throw new Error('No se pudo obtener el usuario después del registro.');
      }
    } catch (e: any) {
      console.error("Error al registrar: ", e);
      throw e; // Propaga el error para que el componente que llama lo maneje
    }
  }

  /**
   * Inicia sesión con email y contraseña.
   * @param email Email del usuario.
   * @param password Contraseña del usuario.
   * @returns Una Promesa que resuelve con el objeto User de Firebase o null.
   */
  async loginUser(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (e: any) {
      console.error("Error al iniciar sesión: ", e);
      throw e;
    }
  }

  /**
   * Cierra la sesión del usuario actual.
   */
  async logoutUser(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (e: any) {
      console.error("Error al cerrar sesión: ", e);
      throw e;
    }
  }

  /**
   * Envía un correo de verificación al objeto User proporcionado.
   * @param user El objeto User al que enviar el correo de verificación.
   */
  async sendVerificationEmail(user: User): Promise<void> {
    try {
      await sendEmailVerification(user);
      console.log('Correo de verificación enviado al usuario:', user.email);
    } catch (e: any) {
      console.error('Error al enviar correo de verificación:', e);
      throw e;
    }
  }

  /**
   * Envía un correo de restablecimiento de contraseña.
   * @param email Email del usuario.
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Correo de restablecimiento de contraseña enviado a:', email);
    } catch (e: any) {
      console.error('Error al enviar correo de restablecimiento:', e);
      throw e;
    }
  }

  /**
   * Obtiene el usuario actualmente autenticado (sincrónicamente, si está disponible).
   * Para observar cambios en tiempo real, usa currentUser$.
   * @returns El objeto User de Firebase o null.
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Obtiene los datos del perfil de un usuario desde Firestore.
   * @param uid ID del usuario.
   * @returns Los datos del perfil o null si no existe.
   */
  async getUserProfile(uid: string): Promise<any> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No existe el documento de perfil para el usuario:", uid);
        return null;
      }
    } catch (e: any) {
      console.error('Error al obtener perfil de usuario:', e);
      throw e;
    }
  }

  /**
   * Actualiza los datos del perfil de un usuario en Firestore.
   * @param uid ID del usuario.
   * @param data Datos a actualizar.
   */
  async updateUserProfile(uid: string, data: any): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userDocRef, data, { merge: true }); // Usar merge: true para no sobrescribir todo el documento
    } catch (e: any) {
      console.error('Error al actualizar perfil de usuario:', e);
      throw e;
    }
  }

  /**
   * Obtiene el rol del usuario actualmente autenticado desde Firestore.
   * @returns El rol del usuario o null.
   */
  async getUserRole(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      const profile = await this.getUserProfile(user.uid);
      return profile ? profile['role'] : null;
    }
    return null;
  }
}