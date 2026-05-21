import { Component, inject, OnInit } from '@angular/core';

import { IncidentsService } from './core/services/incidents-service';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
})
export class App implements OnInit {

  private incidentsService = inject(IncidentsService);

  ngOnInit(): void {

    this.incidentsService.getIncidents()
      .subscribe({
        next: (data) => {
          console.log(data);
        },

        error: (err) => {
          console.error(err);
        },
      });
  }
}
