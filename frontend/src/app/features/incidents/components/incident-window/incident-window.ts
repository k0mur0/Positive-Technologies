import { booleanAttribute, Component, Input, signal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SecurityIncident } from '../../../../core/models/security-incident';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'incident-window',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatDivider,
  ],
  templateUrl: './incident-window.html',
  styleUrl: './incident-window.css',
})

export class IncidentWindow {
  @Input({required: true}) incident!: SecurityIncident;
}
