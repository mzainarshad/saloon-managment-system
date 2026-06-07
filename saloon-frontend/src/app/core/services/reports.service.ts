import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { DashboardKPI } from '../models';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  constructor(private api: ApiService) {}
  getKPI(params?: any): Observable<DashboardKPI> { return this.api.get('/reports/kpi/', params); }
  getSalesReport(params?: any): Observable<any> { return this.api.get('/reports/sales/', params); }
  getStaffCommission(params?: any): Observable<any> { return this.api.get('/reports/staff-commission/', params); }
  getServicePopularity(params?: any): Observable<any> { return this.api.get('/reports/service-popularity/', params); }
}
