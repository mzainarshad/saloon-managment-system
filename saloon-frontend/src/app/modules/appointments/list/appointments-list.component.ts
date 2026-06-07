import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Appointment } from '../../../core/models';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, FormsModule],
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.scss'],
})
export class AppointmentsListComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = true;
  search = '';
  statusFilter = '';
  page = 1;
  totalCount = 0;
  pageSize = 20;
  statuses = ['booked', 'confirmed', 'completed', 'cancelled', 'no_show'];

  constructor(private svc: AppointmentsService, private notify: NotificationService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: any = { page: this.page, page_size: this.pageSize };
    if (this.search) params.search = this.search;
    if (this.statusFilter) params.status = this.statusFilter;
    this.svc.getAll(params).subscribe({
      next: (r: any) => { this.appointments = r.results || r; this.totalCount = r.count || this.appointments.length; this.loading = false; },
      error: () => this.loading = false,
    });
  }

  changeStatus(appt: Appointment, status: string) {
    this.svc.updateStatus(appt.id, status).subscribe({
      next: (updated) => { Object.assign(appt, updated); this.notify.success('Status updated'); },
      error: () => this.notify.error('Failed to update status'),
    });
  }

  delete(appt: Appointment) {
    if (!confirm('Delete this appointment?')) return;
    this.svc.delete(appt.id).subscribe({
      next: () => { this.appointments = this.appointments.filter(a => a.id !== appt.id); this.notify.success('Deleted'); },
      error: () => this.notify.error('Failed'),
    });
  }

  getStatusClass(status: string): string {
    const m: Record<string, string> = { booked: 'badge-info', confirmed: 'badge-success', completed: 'badge-neutral', cancelled: 'badge-danger', no_show: 'badge-warning' };
    return m[status] || 'badge-neutral';
  }

  get totalPages() { return Math.ceil(this.totalCount / this.pageSize); }
  nextPage() { if (this.page < this.totalPages) { this.page++; this.load(); } }
  prevPage() { if (this.page > 1) { this.page--; this.load(); } }
}
