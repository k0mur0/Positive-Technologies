import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import { MatToolbar } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { IncidentStore } from '../../../../core/store/incidents.store';
import { SecurityIncident } from '../../../../core/models/security-incident';
import { INCIDENT_COLUMNS } from '../../../../core/models/incident-collumns';
import { IncidentFilters } from '../../../../core/models/incidents-filter';

import { IncidentWindow } from '../incident-window/incident-window';
import { IncidentDialog } from '../incident-dialog/incident-dialog';
import { NotificationsPanel } from '../../../notifications/notifications-panel/notifications-panel';

const INITIAL_FILTERS: IncidentFilters = {
  showResolved: false,
  severity: '',
  startDate: null,
  endDate: null,
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
    MatSortModule,
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
    MatDialogModule,
    MatSnackBarModule,
    IncidentWindow,
    IncidentDialog,
    NotificationsPanel,
    // Notifications panel is used inside the notifications mat-menu
    // so import it here to enable standalone usage within the menu
    // (keeps tree-shaking intact)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // Note: import symbol below
    
  ],
  styleUrls: ['./incidents-table.css'],
  templateUrl: './incidents-table.html',
})
export class IncidentsTableComponent {
  store = inject(IncidentStore);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  filtersForm = this.fb.nonNullable.group({
    showResolved: INITIAL_FILTERS.showResolved,
    severity: INITIAL_FILTERS.severity,
    startDate: INITIAL_FILTERS.startDate,
    endDate: INITIAL_FILTERS.endDate,
  });

  readonly displayedColumns = this.store.displayedColumns;
  readonly allColumns = INCIDENT_COLUMNS;

  incidents = computed(() => this.store.incidents());
  isDetailsOpened = signal(false);

  formatValue(row: SecurityIncident, column: keyof SecurityIncident): string {
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
    this.store.changePage(event.pageIndex, event.pageSize);
  }

  onSortChange(sort: Sort): void {
    this.store.updateSorting(sort.active, sort.direction);
  }

  onSearchChange(value: string): void {
    this.store.updateSearch(value);
  }

  resetFilters(): void {
    this.filtersForm.reset(INITIAL_FILTERS);
    this.store.resetFilter();
  }

  applyFilters(): void {
    const filters = this.normalizeFilters(this.filtersForm.getRawValue());
    this.store.updateFilters(filters);
  }

  onSelectIncident(id: string): void {
    this.store.getIncident(id);
    this.isDetailsOpened.set(true);
  }

  openIncidentDialog(incident?: SecurityIncident): void {
    const dialogRef = this.dialog.open(IncidentDialog, {
      data: {
        action: incident ? 'edit' : 'create',
        incident,
      },
      width: '920px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      if (result.action === 'save' && result.incident) {
        if (incident) {
          this.store.updateIncident(result.incident);
          this.snackBar.open('Incident updated successfully', 'Close', { duration: 4000 });
        } else {
          this.store.createIncident(result.incident);
          this.snackBar.open('Incident created successfully', 'Close', { duration: 4000 });
        }
      }

      if (result.action === 'delete' && incident) {
        this.deleteIncident(incident.id);
      }
    });
  }

  deleteIncident(id: string): void {
    this.store.deleteIncident(id);
    this.snackBar.open('Incident deleted', 'Close', { duration: 4000 });
  }
  
  // Close the details pane when an incident is deleted
  deleteIncidentAndClose(id: string): void {
    this.deleteIncident(id);
    this.isDetailsOpened.set(false);
  }
  

  private normalizeFilters(filters: IncidentFilters): IncidentFilters {
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    startDate?.setHours(0, 0, 0, 0);
    endDate?.setHours(23, 59, 59, 999);

    return {
      ...filters,
      startDate,
      endDate,
    };
  }
}
