import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-view-my-routine',
  templateUrl: './view-my-routine.page.html',
  styleUrls: ['./view-my-routine.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ViewMyRoutinePage implements OnInit {

  constructor() { }

  ngOnInit() {
    // En un escenario real, aquí cargarías la rutina asignada al usuario desde Firestore.
  }

}