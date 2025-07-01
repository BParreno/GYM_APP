import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor() {
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
  }
}
