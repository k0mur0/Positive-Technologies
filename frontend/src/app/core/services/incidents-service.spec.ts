import { TestBed } from '@angular/core/testing';

import { IncidentsService } from './incidents-service';

describe('Incidents', () => {
  let service: IncidentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
