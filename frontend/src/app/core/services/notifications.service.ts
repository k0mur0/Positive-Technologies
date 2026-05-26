import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { signal } from '@angular/core';
import { NotificationEntry } from '../models/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private eventSource?: EventSource;
  readonly notifications = signal<NotificationEntry[]>([]);

  constructor(private snackBar: MatSnackBar) {}

  connect(): void {
    if (this.eventSource) {
      return;
    }

    this.eventSource = new EventSource('http://localhost:3000/api/notifications/stream');

    this.eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as Omit<NotificationEntry, 'createdAt'> & { createdAt: string };
        const notification: NotificationEntry = {
          ...payload,
          createdAt: new Date(payload.createdAt),
        };

        this.notifications.set([notification, ...this.notifications()]);
        this.snackBar.open(notification.message, 'Close', {
          duration: 5000,
          panelClass: ['toast-notification'],
        });
      } catch {
        this.snackBar.open('Received invalid notification payload', 'Close', {
          duration: 4000,
        });
      }
    };

    this.eventSource.onerror = () => {
      this.snackBar.open('Notification stream disconnected', 'Retry', {
        duration: 5000,
      });
      this.eventSource?.close();
      this.eventSource = undefined;
    };
  }
}
