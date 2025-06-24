// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Aquí se ha movido la configuración de Firebase desde main.ts
  firebaseConfig: { // <-- AÑADIDO
    projectId: "gym-app-fire",
    appId: "1:488766691095:web:d4ce19586f53a4d55f0952",
    storageBucket: "gym-app-fire.firebasestorage.app",
    apiKey: "AIzaSyAZe5d-8TJuu_qrnmaDJh6ETVM6szJXNmI",
    authDomain: "gym-app-fire.firebaseapp.com",
    messagingSenderId: "488766691095",
    measurementId: "G-KW4XX759CR"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';   // Included with Angular CLI.