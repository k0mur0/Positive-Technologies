import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsTable } from './incidents-table.component';

describe('IncidentsTable', () => {
  let component: IncidentsTable;
  let fixture: ComponentFixture<IncidentsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentsTable],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentsTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
