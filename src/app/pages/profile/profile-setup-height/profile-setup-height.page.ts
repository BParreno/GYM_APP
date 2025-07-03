// src/app/pages/profile/profile-setup-height/profile-setup-height.page.ts (MODIFICADO)
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // <-- IMPORTAR ROUTER

@Component({
  selector: 'app-profile-setup-height',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './profile-setup-height.page.html',
  styleUrls: ['./profile-setup-height.page.scss'],
})
export class ProfileSetupHeightPage {
  height = 165;
  heights: number[] = [];

  constructor(private router: Router) { // <-- INYECTAR ROUTER
    this.generateHeights();
  }

  generateHeights() {
    for (let i = 120; i <= 210; i++) {
      this.heights.push(i);
    }
  }

  selectHeight(value: number) {
    this.height = value;
  }

  async saveHeight() {
    console.log('Estatura guardada:', this.height);
    // Aquí puedes integrar Firebase cuando tengas userService
    // Navegar a la página de selección de peso
    this.router.navigateByUrl('/profile-setup-weight'); // <-- NAVEGACIÓN A PESO
  }
}
  