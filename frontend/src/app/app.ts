import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { IncidentStore } from './core/store/incidents.store';
import { IncidentsTableComponent } from './features/incidents/components/incidents-table/incidents-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, IncidentsTableComponent],
  templateUrl: './app.html',
})
export class App implements OnInit {

  incidentStore = inject(IncidentStore);

  ngOnInit(): void {

    this.incidentStore.loadIncidents();
  }


}
