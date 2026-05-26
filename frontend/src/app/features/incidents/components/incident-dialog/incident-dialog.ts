import { Component, EventEmitter, Inject, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SecurityIncident } from '../../../../core/models/security-incident';

export interface IncidentDialogData {
  action: 'create' | 'edit';
  incident?: SecurityIncident;
}

export interface IncidentDialogResult {
  action: 'save' | 'delete';
  incident?: SecurityIncident;
}

@Component({
  selector: 'app-incident-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './incident-dialog.html',
  styleUrls: ['./incident-dialog.css'],
})
export class IncidentDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<IncidentDialog, IncidentDialogResult>);
  readonly data = inject<IncidentDialogData>(MAT_DIALOG_DATA);

  severityOptions = ['Low', 'Medium', 'High'] as const;
  statusOptions = ['Open', 'Investigating', 'Resolved'] as const;
  countryOptions = ['Germany', 'Netherlands', 'United States', 'Canada', 'France'];
  systemOptions = ['Auth Service', 'Database', 'Admin Panel', 'Network', 'Endpoint'];
  tagOptions = ['database', 'authentication', 'critical', 'malware', 'phishing'];

  incidentForm = this.fb.nonNullable.group({
    id: [''],
    title: ['', Validators.required],
    severity: ['Medium', Validators.required],
    status: ['Open', Validators.required],
    assignedTo: ['', Validators.required],
    sourceIp: ['', Validators.required],
    targetIp: ['', Validators.required],
    country: ['', Validators.required],
    attackType: ['', Validators.required],
    affectedSystems: [['Auth Service'] as string[]],
    description: ['', Validators.required],
    isResolved: [false],
    riskScore: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    tags: [['authentication'] as string[]],
    detectionMethod: ['', Validators.required],
    responseTime: [0, [Validators.required, Validators.min(0)]],
    attachmentsCount: [0, [Validators.required, Validators.min(0)]],
    createdAt: [new Date(), Validators.required],
    updatedAt: [new Date(), Validators.required],
    lastActivity: [new Date(), Validators.required],
  });

  constructor() {
    if (this.data.incident) {
      this.incidentForm.patchValue({
        ...this.data.incident,
        createdAt: new Date(this.data.incident.createdAt),
        updatedAt: new Date(this.data.incident.updatedAt),
        lastActivity: new Date(this.data.incident.lastActivity),
      });
    }
  }

  get isEditMode(): boolean {
    return this.data.action === 'edit';
  }

  save(): void {
    if (this.incidentForm.invalid) {
      return;
    }

    const value = this.incidentForm.getRawValue();
    const incident = {
      ...(value as unknown as SecurityIncident),
      createdAt: new Date(value.createdAt),
      updatedAt: new Date(value.updatedAt),
      lastActivity: new Date(value.lastActivity),
    } as SecurityIncident;

    this.dialogRef.close({ action: 'save', incident });
  }

  delete(): void {
    if (!this.isEditMode) {
      return;
    }
    this.dialogRef.close({ action: 'delete', incident: this.incidentForm.getRawValue() as SecurityIncident });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
