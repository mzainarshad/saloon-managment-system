import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CustomersService } from '../../../core/services/customers.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Customer } from '../../../core/models';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, FormsModule],
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
})
export class CustomersListComponent implements OnInit {
  customers: Customer[] = [];
  loading = true;
  search = '';
  page = 1;
  totalCount = 0;
  pageSize = 20;

  constructor(private svc: CustomersService, private notify: NotificationService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: any = { page: this.page, page_size: this.pageSize };
    if (this.search) params.search = this.search;
    this.svc.getAll(params).subscribe({
      next: (r: any) => { this.customers = r.results || r; this.totalCount = r.count || this.customers.length; this.loading = false; },
      error: () => this.loading = false,
    });
  }

  delete(c: Customer) {
    if (!confirm(`Delete ${c.name}?`)) return;
    this.svc.delete(c.id).subscribe({
      next: () => { this.customers = this.customers.filter(x => x.id !== c.id); this.notify.success('Deleted'); },
      error: () => this.notify.error('Failed'),
    });
  }

  get totalPages() { return Math.ceil(this.totalCount / this.pageSize); }
  nextPage() { if (this.page < this.totalPages) { this.page++; this.load(); } }
  prevPage() { if (this.page > 1) { this.page--; this.load(); } }
}
