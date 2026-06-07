import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Product } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private api: ApiService) {}
  getAll(params?: any): Observable<any> { return this.api.get('/inventory/products/', params); }
  getById(id: number): Observable<Product> { return this.api.get(`/inventory/products/${id}/`); }
  create(data: any): Observable<Product> { return this.api.post('/inventory/products/', data); }
  update(id: number, data: any): Observable<Product> { return this.api.put(`/inventory/products/${id}/`, data); }
  delete(id: number): Observable<any> { return this.api.delete(`/inventory/products/${id}/`); }
  getLowStock(): Observable<any> { return this.api.get('/inventory/products/', { low_stock: true }); }
}
