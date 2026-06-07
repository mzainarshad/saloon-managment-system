import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { StaffProfile } from '../models';

@Injectable({ providedIn: 'root' })
export class StaffService {
  constructor(private api: ApiService) { }
  getAll(params?: any): Observable<any> { return this.api.get('/staff/', params); }
  getById(id: number): Observable<StaffProfile> { return this.api.get(`/staff/${id}/`); }
  create(data: any): Observable<StaffProfile> { return this.api.post('/staff/', data); }
  update(id: number, data: any): Observable<StaffProfile> { return this.api.put(`/staff/${id}/`, data); }
  delete(id: number): Observable<any> { return this.api.delete(`/staff/${id}/`); }
}
