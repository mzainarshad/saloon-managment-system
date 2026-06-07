import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../../core/services/users.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  loading = true;

  constructor(
    private svc: UsersService,
    private notify: NotificationService,
    public auth: AuthService,
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getAll({ page_size: 200 }).subscribe({
      next: (r: any) => { this.users = r.results || r; this.loading = false; },
      error: () => this.loading = false,
    });
  }

  delete(u: User) {
    if (!confirm(`Delete user "${u.email}"?`)) return;
    this.svc.delete(u.id).subscribe({
      next: () => { this.users = this.users.filter(x => x.id !== u.id); this.notify.success('Deleted'); },
      error: () => this.notify.error('Failed to delete'),
    });
  }

  getRoleBadgeClass(role: string): string {
    const map: Record<string, string> = {
      super_admin: 'badge-purple',
      admin: 'badge-primary',
      manager: 'badge-blue',
      stylist: 'badge-teal',
      receptionist: 'badge-orange',
      cashier: 'badge-gray',
    };
    return map[role] || 'badge-gray';
  }
}
