import { inject, Injectable, signal } from '@angular/core';
import { IncidentsService } from '../services/incidents-service';
import { SecurityIncident } from '../models/security-incident';
import { IncidentFilters } from '../models/incidents-filter';

const initFilter: IncidentFilters = {
  showResolved: false,
  severity: '',
  startDate: null,
  endDate: null,
};

@Injectable({
  providedIn: 'root',
})
export class IncidentStore {
  private incidentsService = inject(IncidentsService);

  page = signal(0);
  pageSize = signal(10);
  total = signal(0);

  incidents = signal<SecurityIncident[]>([]);
  selectedIncident = signal<SecurityIncident | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  sortField = signal<string>('createdAt');
  sortDirection = signal<'asc' | 'desc' | ''>('');
  search = signal('');

  readonly filters = signal<IncidentFilters>(initFilter);

  displayedColumns = signal<(keyof SecurityIncident)[]>([
    'id',
    'title',
    'severity',
    'status',
    'attackType',
    'assignedTo',
  ]);

  loadIncidents(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.incidentsService
      .getIncidents(
        this.search(),
        this.page(),
        this.pageSize(),
        this.filters(),
        this.sortField(),
        this.sortDirection(),
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

  changePage(page: number, pageSize: number): void {
    this.page.set(page);
    this.pageSize.set(pageSize);
    this.loadIncidents();
  }

  toggleColumn(column: keyof SecurityIncident): void {
    const current = this.displayedColumns();
    const exists = current.includes(column);

    if (exists) {
      this.displayedColumns.set(current.filter((c) => c !== column));
      return;
    }

    this.displayedColumns.set([...current, column]);
  }

  updateSorting(field: string, direction: 'asc' | 'desc' | ''): void {
    this.sortField.set(field);
    this.sortDirection.set(direction);
    this.loadIncidents();
  }

  updateSearch(value: string): void {
    this.search.set(value);
    this.loadIncidents();
  }

  updateFilters(filters: IncidentFilters): void {
    this.filters.set(filters);
    this.page.set(0);
    this.loadIncidents();
  }

  resetFilter(): void {
    this.filters.set(initFilter);
    this.page.set(0);
    this.loadIncidents();
  }

  createIncident(incident: SecurityIncident): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.incidentsService.createIncident(incident).subscribe({
      next: () => {
        this.selectedIncident.set(null);
        this.loadIncidents();
      },
      error: () => {
        this.error.set('Failed to create incident');
        this.isLoading.set(false);
      },
    });
  }

  updateIncident(incident: SecurityIncident): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.incidentsService.updateIncident(incident).subscribe({
      next: () => {
        if (this.selectedIncident()?.id === incident.id) {
          this.selectedIncident.set({ ...incident });
        }
        this.loadIncidents();
      },
      error: () => {
        this.error.set('Failed to update incident');
        this.isLoading.set(false);
      },
    });
  }

  deleteIncident(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.incidentsService.deleteIncident(id).subscribe({
      next: () => {
        if (this.selectedIncident()?.id === id) {
          this.selectedIncident.set(null);
        }
        this.loadIncidents();
      },
      error: () => {
        this.error.set('Failed to delete incident');
        this.isLoading.set(false);
      },
    });
  }

  getIncident(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.incidentsService.getIncident(id).subscribe({
      next: (response) => {
        this.selectedIncident.set({ ...response });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load incident details');
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }
}
