import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { SecurityIncident } from '../models/security-incident';

@Injectable({
  providedIn: 'root',
})

export class IncidentsService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/incidents';

  getIncidents(): Observable<SecurityIncident[]> {
    return this.http.get<SecurityIncident[]>(this.apiUrl);
  }
}
