import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ServicesService } from '../../../core/services/services.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, FormsModule],
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
})
export class ServicesListComponent implements OnInit {
  services: any[] = [];
  loading = true;
  search = '';
  constructor(private svc: ServicesService, private notify: NotificationService) {}
  ngOnInit() { this.load(); }
  load() {
    this.loading = true;
    this.svc.getAll({ page_size: 200, search: this.search }).subscribe({ next: (r: any) => { this.services = r.results || r; this.loading = false; }, error: () => this.loading = false });
  }
  delete(s: any) {
    if (!confirm(`Delete ${s.name}?`)) return;
    this.svc.delete(s.id).subscribe({ next: () => { this.services = this.services.filter(x => x.id !== s.id); this.notify.success('Deleted'); }, error: () => this.notify.error('Failed') });
  }
}
