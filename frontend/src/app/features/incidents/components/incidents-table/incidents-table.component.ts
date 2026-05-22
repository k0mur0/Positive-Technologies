import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent }
from '@angular/material/paginator';

import { MatCheckboxModule }
from '@angular/material/checkbox';

import { MatButtonModule }
from '@angular/material/button';

import { MatMenuModule }
from '@angular/material/menu';

import { IncidentStore } from '../../../../core/store/incidents.store';
import { SecurityIncident } from '../../../../core/models/security-incident';
import { INCIDENT_COLUMNS } from '../../../../core/models/incident-collumns';

@Component({
  selector: 'app-incidents-table',
  standalone: true,

  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonModule,
    MatMenuModule
  ],

  styleUrl: './incidents-table.css',

  templateUrl: './incidents-table.html',
})
export class IncidentsTableComponent {

  store = inject(IncidentStore);

  readonly displayedColumns = this.store.displayedColumns;
  readonly allColumns = INCIDENT_COLUMNS;

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
