import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent }
from '@angular/material/paginator';

import { IncidentStore } from '../../../../core/store/incidents.store';
import { SecurityIncident } from '../../../../core/models/security-incident';

@Component({
  selector: 'app-incidents-table',
  standalone: true,

  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
  ],

  styleUrl: './incidents-table.css',

  templateUrl: './incidents-table.html',
})
export class IncidentsTableComponent {

  store = inject(IncidentStore);

  displayedColumns: (keyof SecurityIncident)[] = [
    'id',
    'title',
    'severity',
    'status',
    'attackType',
    'assignedTo',
  ];

  incidents = computed(() => this.store.incidents());

  formatValue(
    row: SecurityIncident,
    column: keyof SecurityIncident
  ): string {

    const value = row[column];

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    return String(value);
  }

  onPageChange(event: PageEvent): void {
    this.store.changePage(
      event.pageIndex,
      event.pageSize
    );
  }
}
