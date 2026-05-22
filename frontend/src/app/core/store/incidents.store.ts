import { inject, Injectable, signal } from "@angular/core";
import { IncidentsService } from "../services/incidents-service";
import { SecurityIncident } from "../models/security-incident";

@Injectable({
  providedIn: `root`,
})
export class IncidentStore{
  private incidentsService = inject(IncidentsService);

  page = signal(0);
  pageSize = signal(10);
  total = signal(0);

  incidents = signal<SecurityIncident[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  loadIncidents(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.incidentsService
      .getIncidents(
        this.page(),
        this.pageSize()
      )

      .subscribe({
        next: (response) => {
          this.incidents.set(response.items);
          this.total.set(response.total);
          this.isLoading.set(false);
        },

        error: () => {
          this.error.set('Failed to load incidents');
          this.isLoading.set(false);
        },
      });
  }

  changePage(
    page: number,
    pageSize: number
  ): void {
    this.page.set(page);
    this.pageSize.set(pageSize);
    this.loadIncidents();
  }
}
