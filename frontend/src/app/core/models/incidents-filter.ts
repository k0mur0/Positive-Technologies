export interface IncidentFilters {
  showResolved: boolean;
  severity: string;
  startDate: Date | null;
  endDate: Date | null;
}