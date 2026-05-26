export interface NotificationEntry {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  incidentId?: string;
  createdAt: Date;
}
