import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Customer, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class CustomersService {
  constructor(private api: ApiService) {}
  getAll(params?: any): Observable<PaginatedResponse<Customer>> { return this.api.get('/customers/', params); }
  getById(id: number): Observable<Customer> { return this.api.get(`/customers/${id}/`); }
  create(data: Partial<Customer>): Observable<Customer> { return this.api.post('/customers/', data); }
  update(id: number, data: Partial<Customer>): Observable<Customer> { return this.api.put(`/customers/${id}/`, data); }
  delete(id: number): Observable<any> { return this.api.delete(`/customers/${id}/`); }
  getHistory(id: number): Observable<any> { return this.api.get(`/customers/${id}/history/`); }
}
