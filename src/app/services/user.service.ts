import { Injectable } from '@angular/core';
    import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
    import { from, Observable } from 'rxjs';
    import { map } from 'rxjs/operators';

    @Injectable({
      providedIn: 'root'
    })
    export class UserService {

      constructor(private firestore: Firestore) {}

      /**
       * Crea un nuevo documento de perfil de usuario en Firestore.
       * Esto se usa típicamente la primera vez que un usuario se registra.
       * (Aunque tu AuthService ya lo hace, este método ofrece una alternativa o un punto de centralización si se desea).
       * @param uid El UID del usuario de Firebase Authentication.
       * @param data Los datos iniciales del perfil (email, username, role, etc.).
       * @returns Un Observable que completa cuando el documento ha sido creado.
       */
  createUserProfile(uid: string, data: any): Observable<void> {
        const userDocRef = doc(this.firestore, `users/${uid}`);
        return from(setDoc(userDocRef, data));
      }

      /**
       * Obtiene los datos del perfil de un usuario por su UID.
       * @param uid El UID del usuario de Firebase Authentication.
       * @returns Un Observable que emite los datos del perfil del usuario, o null si no existe.
       */
      getUserProfile(uid: string): Observable<any | null> {
        const userDocRef = doc(this.firestore, `users/${uid}`);
        return from(getDoc(userDocRef)).pipe(
          map(snapshot => {
            if (snapshot.exists()) {
              // Devuelve los datos del documento si existe
              return snapshot.data();
            } else {
              // El documento no existe
              return null;
            }
          })
        );
      }
   /**
       * Actualiza los datos de perfil de un usuario existente.
       * Se usa para añadir o modificar campos como edad, peso, altura, etc.
       * @param uid El UID del usuario de Firebase Authentication.
       * @param data Un objeto con los campos a actualizar. Firestore fusionará los cambios.
       * @returns Un Observable que completa cuando el documento ha sido actualizado.
       */
      updateUserProfile(uid: string, data: any): Observable<void> {
        const userDocRef = doc(this.firestore, `users/${uid}`);
        return from(updateDoc(userDocRef, data));
      }
    }
