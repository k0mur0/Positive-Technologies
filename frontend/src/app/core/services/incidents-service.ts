import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

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

  getIncidents(
    search: string,
    page: number,
    pageSize: number,
    filters: IncidentFilters,
    sortField?: string,
    sortDirection?: string,
  ) {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('pageSize', pageSize)
      .set('sortField', sortField ?? '')
      .set('sortDirection', sortDirection ?? '')
      .set('severity', filters.severity)
      .set('showResolved', filters.showResolved.toString())
      
      if (filters.startDate) {
        params = params.set(
          'startDate',
          filters.startDate.toISOString()
        );
      }

      if (filters.endDate) {
        params = params.set(
          'endDate',
          filters.endDate.toISOString()
        );
      }

    return this.http.get<PaginatedResponse<SecurityIncident>>(
      this.apiUrl,
      { params }
    );
  }

  getIncident(id: string) {
    return this.http.get<SecurityIncident>(`${this.apiUrl}/${id}`);
  }
}
