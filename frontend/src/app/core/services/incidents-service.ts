import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { SecurityIncident } from '../models/security-incident';
import { PaginatedResponse } from '../models/paginated-response';
import { IncidentFilters } from '../models/incidents-filter';

@Injectable({
  providedIn: 'root',
})
export class IncidentsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/incidents';

  private normalizeIncident(raw: any): SecurityIncident {
    return {
      ...raw,
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
      lastActivity: new Date(raw.lastActivity),
    };
  }

  private normalizePage(response: PaginatedResponse<any>): PaginatedResponse<SecurityIncident> {
    return {
      ...response,
      items: response.items.map((item) => this.normalizeIncident(item)),
    };
  }

  private serializeIncident(incident: SecurityIncident): any {
    return {
      ...incident,
      createdAt: incident.createdAt.toISOString(),
      updatedAt: incident.updatedAt.toISOString(),
      lastActivity: incident.lastActivity.toISOString(),
    };
  }

  getIncidents(
    search: string,
    page: number,
    pageSize: number,
    filters: IncidentFilters,
    sortField?: string,
    sortDirection?: string,
  ): Observable<PaginatedResponse<SecurityIncident>> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('pageSize', pageSize)
      .set('sortField', sortField ?? '')
      .set('sortDirection', sortDirection ?? '')
      .set('severity', filters.severity)
      .set('showResolved', filters.showResolved.toString());

    if (filters.startDate) {
      params = params.set('startDate', filters.startDate.toISOString());
    }

    if (filters.endDate) {
      params = params.set('endDate', filters.endDate.toISOString());
    }

    return this.http
      .get<PaginatedResponse<any>>(this.apiUrl, { params })
      .pipe(map((response) => this.normalizePage(response)));
  }

  getIncident(id: string): Observable<SecurityIncident> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((incident) => this.normalizeIncident(incident)));
  }

  createIncident(incident: SecurityIncident): Observable<SecurityIncident> {
    return this.http
      .post<any>(this.apiUrl, this.serializeIncident(incident))
      .pipe(map((incident) => this.normalizeIncident(incident)));
  }

  updateIncident(incident: SecurityIncident): Observable<SecurityIncident> {
    return this.http
      .put<any>(`${this.apiUrl}/${incident.id}`, this.serializeIncident(incident))
      .pipe(map((incident) => this.normalizeIncident(incident)));
  }

  deleteIncident(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
