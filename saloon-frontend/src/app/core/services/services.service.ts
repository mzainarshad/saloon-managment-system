import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Service, ServiceCategory } from '../models';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  constructor(private api: ApiService) {}
  getAll(params?: any): Observable<any> { return this.api.get('/services/', params); }
  getById(id: number): Observable<Service> { return this.api.get(`/services/${id}/`); }
  create(data: Partial<Service>): Observable<Service> { return this.api.post('/services/', data); }
  update(id: number, data: Partial<Service>): Observable<Service> { return this.api.put(`/services/${id}/`, data); }
  delete(id: number): Observable<any> { return this.api.delete(`/services/${id}/`); }
  getCategories(): Observable<any> { return this.api.get('/services/categories/'); }
  createCategory(data: any): Observable<ServiceCategory> { return this.api.post('/services/categories/', data); }
}
