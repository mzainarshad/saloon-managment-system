import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PosService } from '../../../core/services/pos.service';
import { ReportsService } from '../../../core/services/reports.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterLink],
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss'],
})
export class SalesReportComponent implements OnInit {
  sales: any[] = [];
  loading = true;
  page = 1; totalCount = 0; pageSize = 20;
  dateFrom = ''; dateTo = ''; statusFilter = ''; paymentFilter = '';
  statuses = ['completed', 'pending', 'refunded', 'voided'];
  payments = ['cash', 'card', 'online', 'gift_card', 'loyalty'];
  summary: any = null;

  constructor(private pos: PosService, private reports: ReportsService, private notify: NotificationService) {}
  ngOnInit() { this.load(); this.loadSummary(); }

  load() {
    this.loading = true;
    const params: any = { page: this.page, page_size: this.pageSize };
    if (this.dateFrom) params.created_at__date__gte = this.dateFrom;
    if (this.dateTo) params.created_at__date__lte = this.dateTo;
    if (this.statusFilter) params.status = this.statusFilter;
    if (this.paymentFilter) params.payment_method = this.paymentFilter;
    this.pos.getSales(params).subscribe({ next: (r: any) => { this.sales = r.results || r; this.totalCount = r.count || this.sales.length; this.loading = false; }, error: () => this.loading = false });
  }

  loadSummary() {
    this.pos.getTodaySummary().subscribe({ next: s => this.summary = s, error: () => {} });
  }

  get totalPages() { return Math.ceil(this.totalCount / this.pageSize); }
  nextPage() { if (this.page < this.totalPages) { this.page++; this.load(); } }
  prevPage() { if (this.page > 1) { this.page--; this.load(); } }

  getStatusClass(s: string): string {
    const m: Record<string, string> = { completed: 'badge-success', pending: 'badge-warning', refunded: 'badge-info', voided: 'badge-danger' };
    return m[s] || 'badge-neutral';
  }
}
