import { Component, inject, OnInit } from '@angular/core';
import { IncidentStore } from './core/store/indcidents.store';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
})
export class App implements OnInit {

  incidentStore = inject(IncidentStore)

  ngOnInit(): void {
    this.incidentStore.loadIncidents();
  }
}
