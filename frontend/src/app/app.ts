import { Component, inject, OnInit } from '@angular/core';

import { IncidentStore } from './core/store/incidents.store';

import { IncidentsTableComponent } from './features/incidents/components/incidents-table/incidents-table.component';

@Component({
  selector: 'app-root',

  standalone: true,

  imports: [
    IncidentsTableComponent,
  ],

  templateUrl: './app.html',
})
export class App implements OnInit {

  incidentStore = inject(IncidentStore);

  ngOnInit(): void {

    this.incidentStore.loadIncidents();
  }


}
