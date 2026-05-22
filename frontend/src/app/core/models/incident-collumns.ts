import { SecurityIncident } from "./security-incident";

export interface IncidentColumn {

  key: keyof SecurityIncident;

  label: string;
}

export const INCIDENT_COLUMNS: IncidentColumn[] = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'severity', label: 'Severity' },
  { key: 'status', label: 'Status' },
  { key: 'attackType', label: 'Attack Type' },
  { key: 'assignedTo', label: 'Assigned To' },
  { key: 'country', label: 'Country' },
  { key: 'sourceIp', label: 'Source IP' },
  { key: 'targetIp', label: 'Target IP' },
  { key: 'riskScore', label: 'Risk Score' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'updatedAt', label: 'Updated At' },
  { key: 'isResolved', label: 'Is resolved' },
  { key: 'responseTime', label: 'Response Time' },
  { key: 'affectedSystems', label: 'Affected system' },
  { key: 'description', label: 'description' },
  { key: 'detectionMethod', label: 'Detection method' },
  { key: 'attachmentsCount', label: 'Attachmets count' },
  { key: 'lastActivity', label: 'Last activity' },
  { key: 'tags', label: 'Tags' },
];
