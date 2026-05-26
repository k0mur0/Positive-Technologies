import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NotificationsService } from '../../../core/services/notifications.service';

@Component({
  selector: 'notifications-panel',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule],
  templateUrl: './notifications-panel.html',
  styleUrls: ['./notifications-panel.css'],
})
export class NotificationsPanel {
  notificationsService = inject(NotificationsService);
  notifications = this.notificationsService.notifications;

  constructor() {
    this.notificationsService.connect();
  }
}
