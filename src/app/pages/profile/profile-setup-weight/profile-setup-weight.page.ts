// src/app/pages/profile/profile-setup-weight/profile-setup-weight.page.ts (MODIFICADO)
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // <-- IMPORTAR ROUTER

@Component({
  selector: 'app-profile-setup-weight',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './profile-setup-weight.page.html',
  styleUrls: ['./profile-setup-weight.page.scss'],
})
export class ProfileSetupWeightPage {
  weight = 75;
  unit: 'kg' | 'lb' = 'kg';
  weights: number[] = [];

  constructor(private router: Router) { // <-- INYECTAR ROUTER
    this.generateWeights();
  }

  generateWeights() {
    for (let i = 30; i <= 200; i++) {
      this.weights.push(i);
    }
  }

  selectWeight(value: number) {
    this.weight = value;
  }

  async saveWeight() {
    console.log('Peso a guardar:', this.weight, this.unit);
    // Navegar a la página de selección de rol
    this.router.navigateByUrl('/role-selection'); // <-- NAVEGACIÓN A SELECCIÓN DE ROL
  }
}