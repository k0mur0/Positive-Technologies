import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SecurityIncident } from '../../../../core/models/security-incident';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'incident-window',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './incident-window.html',
  styleUrls: ['./incident-window.css'],
})
export class IncidentWindow {
  @Input({ required: true }) incident!: SecurityIncident;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}
