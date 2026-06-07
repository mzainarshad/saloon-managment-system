import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private path = '/auth/users/';

  constructor(private api: ApiService) {}

  getAll(params?: Record<string, any>): Observable<PaginatedResponse<User> | User[]> {
    return this.api.get<PaginatedResponse<User> | User[]>(this.path, params);
  }

  getById(id: number): Observable<User> {
    return this.api.get<User>(`${this.path}${id}/`);
  }

  create(data: Partial<User> & { password: string; password2: string }): Observable<User> {
    return this.api.post<User>('/auth/register/', data);
  }

  update(id: number, data: Partial<User>): Observable<User> {
    return this.api.patch<User>(`${this.path}${id}/`, data);
  }

  delete(id: number): Observable<any> {
    return this.api.delete(`${this.path}${id}/`);
  }
}
