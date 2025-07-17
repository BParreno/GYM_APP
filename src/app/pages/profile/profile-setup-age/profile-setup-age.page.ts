import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-setup-age',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './profile-setup-age.page.html',
  styleUrls: ['./profile-setup-age.page.scss'],
})
export class ProfileSetupAgePage {
  age: number = 18;

  constructor(private navCtrl: NavController) {}

  increaseAge() {
    if (this.age < 110) {
      this.age++;
    }
  }

  decreaseAge() {
    if (this.age > 6) {
      this.age--;
    }
  }

  continue() {
    if (this.age < 6) {
      alert("La edad mínima es 6 años");
    } else if (this.age > 110) {
      alert("La edad máxima permitida es 110 años");
    } else {
      // Acción al continuar, como guardar o navegar
      console.log("Edad válida:", this.age);
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
