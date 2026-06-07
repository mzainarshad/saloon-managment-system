import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { StaffService } from '../../../core/services/staff.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss'],
})
export class StaffListComponent implements OnInit {
  staff: any[] = [];
  loading = true;
  constructor(private svc: StaffService, private notify: NotificationService) { }
  ngOnInit() { this.load(); }
  load() {
    this.loading = true;
    this.svc.getAll({ page_size: 100 }).subscribe({ next: (r: any) => { this.staff = r.results || r; this.loading = false; }, error: () => this.loading = false });
  }
  delete(s: any) {
    if (!confirm(`Remove ${s.name || s.user?.first_name}?`)) return;
    this.svc.delete(s.id).subscribe({ next: () => { this.staff = this.staff.filter(x => x.id !== s.id); this.notify.success('Removed'); }, error: () => this.notify.error('Failed') });
  }
  getName(s: any): string { return s.name || `${s.user?.first_name || ''} ${s.user?.last_name || ''}`.trim() || 'Unknown'; }
}
