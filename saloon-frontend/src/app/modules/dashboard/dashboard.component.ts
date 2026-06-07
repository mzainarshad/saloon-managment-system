import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, ArcElement, PieController, Legend, Tooltip, Filler } from 'chart.js';
import { ReportsService } from '../../core/services/reports.service';
import { DashboardKPI } from '../../core/models';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, ArcElement, PieController, Legend, Tooltip, Filler);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  kpi: DashboardKPI | null = null;
  loading = true;
  trendPeriod: 'day' | 'week' | 'month' = 'week';

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Sales', borderColor: '#111', backgroundColor: 'rgba(17,17,17,.08)', tension: .4, fill: true, pointBackgroundColor: '#111', pointRadius: 4 }]
  };
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: '#f0f0f0' } } }
  };

  pieChartData: ChartData<'pie'> = { labels: [], datasets: [{ data: [], backgroundColor: ['#111','#555','#999','#ccc','#eee'] }] };
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: { legend: { position: 'right', labels: { font: { size: 11 } } } }
  };

  constructor(private reports: ReportsService) {}

  ngOnInit() { this.loadKPI(); }

  loadKPI() {
    this.loading = true;
    this.reports.getKPI({ period: this.trendPeriod }).subscribe({
      next: (data) => { this.kpi = data; this.buildCharts(data); this.loading = false; },
      error: () => this.loading = false,
    });
  }

  buildCharts(data: DashboardKPI) {
    if (data.sales_trend?.length) {
      this.lineChartData = {
        labels: data.sales_trend.map(d => d.date),
        datasets: [{ data: data.sales_trend.map(d => d.total), label: 'Sales', borderColor: '#111', backgroundColor: 'rgba(17,17,17,.08)', tension: .4, fill: true, pointBackgroundColor: '#111', pointRadius: 4 }]
      };
    }
    if (data.payment_distribution?.length) {
      this.pieChartData = {
        labels: data.payment_distribution.map(p => p.payment_method),
        datasets: [{ data: data.payment_distribution.map(p => Number(p.amount)), backgroundColor: ['#111','#444','#777','#aaa','#ddd'] }]
      };
    }
  }

  setPeriod(p: 'day' | 'week' | 'month') { this.trendPeriod = p; this.loadKPI(); }

  getStatusClass(status: string): string {
    const map: Record<string, string> = { booked: 'badge-info', confirmed: 'badge-success', completed: 'badge-neutral', cancelled: 'badge-danger', no_show: 'badge-warning' };
    return map[status] || 'badge-neutral';
  }
}
