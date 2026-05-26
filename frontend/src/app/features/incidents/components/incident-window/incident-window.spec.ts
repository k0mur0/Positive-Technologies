import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentWindow } from './incident-window';

describe('IncidentWindow', () => {
  let component: IncidentWindow;
  let fixture: ComponentFixture<IncidentWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentWindow],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentWindow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
