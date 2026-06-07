import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ReportsService } from '../../../core/services/reports.service';

@Component({
  selector: 'app-staff-report',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './staff-report.component.html',
  styleUrls: ['./staff-report.component.scss'],
})
export class StaffReportComponent implements OnInit {
  report: any[] = [];
  loading = true;
  dateFrom = ''; dateTo = '';

  constructor(private svc: ReportsService) {}
  ngOnInit() { this.load(); }
  load() {
  this.loading = true;
  const p: any = {};
  if (this.dateFrom) p.start = this.dateFrom;
  if (this.dateTo) p.end = this.dateTo;
  this.svc.getStaffCommission(p).subscribe({ 
    next: r => { this.report = Array.isArray(r) ? r : (r.results || []); this.loading = false; }, 
    error: () => this.loading = false 
  });
}
}
