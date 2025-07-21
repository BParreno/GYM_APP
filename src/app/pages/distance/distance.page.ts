import { Component, inject } from '@angular/core';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { BluetoothLe } from '@capacitor-community/bluetooth-le';
import { collection, addDoc, Firestore } from '@angular/fire/firestore';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-distancia',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './distance.page.html',
})
export class DistancePage {
  firestore = inject(Firestore);
  distancia: string = '--';
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);

  async conectarYLeer() {
    const loading = await this.loadingCtrl.create({
      message: 'Buscando dispositivo...',
      spinner: 'circles',
    });
    await loading.present();

    try {
      await this.pedirPermisosAndroid();
      await BluetoothLe.initialize();

      const { deviceId } = await BluetoothLe.requestDevice({
        services: ['12345678-1234-1234-1234-1234567890ab'],
        optionalServices: ['battery_service'], // <- mejora compatibilidad
      });

      await BluetoothLe.connect({ deviceId });

      await BluetoothLe.startNotifications({
        deviceId,
        service: '12345678-1234-1234-1234-1234567890ab',
        characteristic: 'abcdefab-1234-1234-1234-abcdefabcdef',
      });

      BluetoothLe.addListener('onNotificationReceived', async (event: any) => {
        const value = new TextDecoder().decode(new Uint8Array(event.value));
        this.distancia = value + ' cm';
        await this.subirAFirebase(parseFloat(value));
      });

      this.mostrarToast('Dispositivo conectado ✅');
    } catch (error) {
      console.error('Error:', error);
      this.mostrarToast('Error al conectar: ' + error);
    } finally {
      await loading.dismiss();
    }
  }

  async subirAFirebase(distancia: number) {
    try {
      const col = collection(this.firestore, 'mediciones');
      await addDoc(col, {
        distancia,
        fecha: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Firebase error:', err);
      this.mostrarToast('Error al guardar en Firebase');
    }
  }

 
async pedirPermisosAndroid() {
  if (Capacitor.getPlatform() === 'android') {
    const permissions = [
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.BLUETOOTH',
      'android.permission.BLUETOOTH_ADMIN',
      'android.permission.BLUETOOTH_SCAN',
      'android.permission.BLUETOOTH_CONNECT',
    ];

    for (const permission of permissions) {
      try {
        const result = await (navigator as any).permissions.query({ name: permission });
        console.log('Permiso verificado:', permission, result.state);
      } catch (e) {
        // ignorar errores, algunas versiones no soportan esta API
        console.warn('No se pudo verificar:', permission);
      }
    }
  }
}

  async mostrarToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }
  simularDistanciaActiva = false;
simulacionInterval: any;

iniciarSimulacion() {
  if (this.simularDistanciaActiva) {
    this.mostrarToast('Simulación ya en curso');
    return;
  }

  this.simularDistanciaActiva = true;
  this.mostrarToast('Simulación iniciada');

  this.simulacionInterval = setInterval(async () => {
    const distanciaSimulada = this.obtenerValorAleatorio(4, 50);
    this.distancia = `${distanciaSimulada} cm`;
    await this.subirAFirebase(distanciaSimulada);
  }, 2000); // cada 2 segundos
}

detenerSimulacion() {
  if (this.simulacionInterval) {
    clearInterval(this.simulacionInterval);
    this.simulacionInterval = null;
    this.simularDistanciaActiva = false;
    this.mostrarToast('Simulación detenida');
  }
}

obtenerValorAleatorio(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

}

