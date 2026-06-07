import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Company, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class CompaniesService {
  private path = '/companies/';

  constructor(private api: ApiService) {}

  getAll(params?: Record<string, any>): Observable<PaginatedResponse<Company> | Company[]> {
    return this.api.get<PaginatedResponse<Company> | Company[]>(this.path, params);
  }

  getById(id: number): Observable<Company> {
    return this.api.get<Company>(`${this.path}${id}/`);
  }

  create(data: Partial<Company>): Observable<Company> {
    return this.api.post<Company>(this.path, data);
  }

  update(id: number, data: Partial<Company>): Observable<Company> {
    return this.api.patch<Company>(`${this.path}${id}/`, data);
  }

  delete(id: number): Observable<any> {
    return this.api.delete(`${this.path}${id}/`);
  }

  toggleActive(id: number, is_active: boolean): Observable<Company> {
    return this.api.patch<Company>(`${this.path}${id}/`, { is_active });
  }
}
