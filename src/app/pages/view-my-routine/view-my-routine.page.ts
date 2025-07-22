// src/app/pages/view-my-routine/view-my-routine.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router'; // Importar Router
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-view-my-routine',
  templateUrl: './view-my-routine.page.html',
  styleUrls: ['./view-my-routine.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ViewMyRoutinePage implements OnInit {

  constructor(private router: Router, private navCtrl: NavController) { } // Inyectar Router

  ngOnInit() {
    // En un escenario real, aquí cargarías la rutina asignada al usuario desde Firestore.
  }

  
goToRoutines() {
  this.navCtrl.navigateForward('/select-routine');
}

}