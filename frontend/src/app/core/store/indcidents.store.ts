import { inject, Injectable, signal } from "@angular/core";
import { IncidentsService } from "../services/incidents-service";
import { SecurityIncident } from "../models/security-incident";

@Injectable({
  providedIn: `root`,
})
export class IncidentStore{
  private incidentsService = inject(IncidentsService);

  incidents = signal<SecurityIncident[]>([]);

  isLoading = signal(false);

  error = signal<string | null>(null);

  loadIncidents(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.incidentsService.getIncidents().subscribe({
      next: (data) => {
        this.incidents.set(data);

        this.isLoading.set(false);
      },

      error: (err) => {
        this.error.set(`Не удалось загрузить данные: ${err}`);
        this.isLoading.set(false)
      }
    })
  }
}
