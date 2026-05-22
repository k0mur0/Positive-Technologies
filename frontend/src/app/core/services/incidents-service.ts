import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { SecurityIncident } from '../models/security-incident';
import { PaginatedResponse } from '../models/paginated-response';

@Injectable({
  providedIn: 'root',
})

export class IncidentsService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/incidents';

  getIncidents(
  page: number,
  pageSize: number
) {

  const params = new HttpParams()
    .set('page', page)
    .set('pageSize', pageSize);

  return this.http.get<PaginatedResponse<SecurityIncident>>(
    this.apiUrl,
    { params }
  );
}
}
