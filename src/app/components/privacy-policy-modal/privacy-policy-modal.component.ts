// src/app/components/privacy-policy-modal/privacy-policy-modal.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-privacy-policy-modal',
  templateUrl: './privacy-policy-modal.component.html',
  styleUrls: ['./privacy-policy-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class PrivacyPolicyModalComponent implements OnInit {
  // Esta propiedad recibirá el contenido HTML desde la página que abre el modal
  @Input() policyContentHtml: string = '';

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    // Puedes usar esto para depurar si el contenido llega correctamente
    // console.log('Contenido de la política recibido en modal:', this.policyContentHtml);
  }

  // Método para cerrar el modal
  dismiss() {
    this.modalController.dismiss();
  }
}