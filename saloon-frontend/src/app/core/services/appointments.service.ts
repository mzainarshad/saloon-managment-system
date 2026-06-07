import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Appointment } from '../models';

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  constructor(private api: ApiService) {}
  getAll(params?: any): Observable<any> { return this.api.get('/appointments/', params); }
  getById(id: number): Observable<Appointment> { return this.api.get(`/appointments/${id}/`); }
  create(data: any): Observable<Appointment> { return this.api.post('/appointments/', data); }
  update(id: number, data: any): Observable<Appointment> { return this.api.put(`/appointments/${id}/`, data); }
  updateStatus(id: number, status: string): Observable<Appointment> { return this.api.patch(`/appointments/${id}/`, { status }); }
  delete(id: number): Observable<any> { return this.api.delete(`/appointments/${id}/`); }
}
