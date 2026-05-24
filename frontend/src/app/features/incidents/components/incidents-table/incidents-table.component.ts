import {
  Component,
  computed,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatCheckboxModule }from '@angular/material/checkbox';
import { MatButtonModule }from '@angular/material/button';
import { MatMenuModule }from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSort,
  Sort,
  MatSortModule
} from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import {MatToolbar} from '@angular/material/toolbar'
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';

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
    MatMenuModule,
    MatIconButton,
    MatIconModule,
    MatSort,
    MatSortModule,
    MatTooltip,
    MatToolbar,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
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

  onSortChange(sort: Sort): void {

    this.store.updateSorting(
      sort.active,
      sort.direction
    );
  }
}
