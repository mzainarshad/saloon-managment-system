import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Sale } from '../models';

@Injectable({ providedIn: 'root' })
export class PosService {
  constructor(private api: ApiService) {}
  getSales(params?: any): Observable<any> { return this.api.get('/pos/sales/', params); }
  getSale(id: number): Observable<Sale> { return this.api.get(`/pos/sales/${id}/`); }
  createSale(data: any): Observable<Sale> { return this.api.post('/pos/sales/', data); }
  getReceipt(id: number): Observable<Sale> { return this.api.get(`/pos/sales/${id}/receipt/`); }
  getTodaySummary(): Observable<any> { return this.api.get('/pos/sales/today_summary/'); }
}
