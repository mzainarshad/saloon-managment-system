import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ReportsService } from '../../../core/services/reports.service';

@Component({
  selector: 'app-services-report',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './services-report.component.html',
  styleUrls: ['./services-report.component.scss'],
})
export class ServicesReportComponent implements OnInit {
  report: any[] = [];
  loading = true;
  constructor(private svc: ReportsService) {}
  ngOnInit() { this.svc.getServicePopularity().subscribe({ next: r => { this.report = Array.isArray(r) ? r : (r.results || []); this.loading = false; }, error: () => this.loading = false }); }
}
