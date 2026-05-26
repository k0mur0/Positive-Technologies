import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatCheckboxModule }from '@angular/material/checkbox';
import { MatMenuModule }from '@angular/material/menu';
import { MatIconButton, MatButton } from '@angular/material/button';
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
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';

import { IncidentStore } from '../../../../core/store/incidents.store';
import { SecurityIncident } from '../../../../core/models/security-incident';
import { INCIDENT_COLUMNS } from '../../../../core/models/incident-collumns';
import { IncidentFilters } from '../../../../core/models/incidents-filter';

import { IncidentWindow } from '../incident-window/incident-window';

const INITIAL_FILTERS: IncidentFilters = {
  showResolved: false,
  severity: '',
  startDate: null,
  endDate: null
};

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
    MatInputModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatButton,
    ReactiveFormsModule,
    MatSidenavModule,
    IncidentWindow
  ],

  styleUrl: './incidents-table.css',

  templateUrl: './incidents-table.html',
})
export class IncidentsTableComponent {

  store = inject(IncidentStore);
  private fb = inject(FormBuilder);

  filtersForm = this.fb.nonNullable.group({
    showResolved: INITIAL_FILTERS.showResolved,
    severity: INITIAL_FILTERS.severity,
    startDate: INITIAL_FILTERS.startDate,
    endDate: INITIAL_FILTERS.endDate
  });

  readonly displayedColumns = this.store.displayedColumns;
  readonly allColumns = INCIDENT_COLUMNS;

  incidents = computed(() => this.store.incidents());
  
  isDetailsOpened = signal(false);

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

  onSearchChange(value: string): void {
    this.store.updateSearch(value);
  }

  resetFilters(): void {
    this.filtersForm.reset(INITIAL_FILTERS);
    this.store.resetFilter();
}
  
  applyFilters(): void {

    const filters = this.normalizeFilters(
      this.filtersForm.getRawValue()
    );

    this.store.updateFilters(filters);
  }

  onSelectIncident(id: string): void {
    this.store.getIncident(id);
    this.isDetailsOpened.set(true);
  }

  private normalizeFilters(filters: IncidentFilters): IncidentFilters {
    const startDate = filters.startDate
      ? new Date(filters.startDate)
      : null;
    const endDate = filters.endDate
      ? new Date(filters.endDate)
      : null;

    startDate?.setHours(0, 0, 0, 0);
    endDate?.setHours(23, 59, 59, 999);

    return {
      ...filters,
      startDate,
      endDate,
    };
  }
}
