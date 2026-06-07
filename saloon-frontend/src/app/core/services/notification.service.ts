import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast { type: 'success' | 'error' | 'info' | 'warning'; message: string; id: number; }

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private toasts$ = new Subject<Toast>();
  toasts = this.toasts$.asObservable();
  private counter = 0;

  private show(type: Toast['type'], message: string) {
    this.toasts$.next({ type, message, id: ++this.counter });
  }
  success(msg: string) { this.show('success', msg); }
  error(msg: string) { this.show('error', msg); }
  info(msg: string) { this.show('info', msg); }
  warning(msg: string) { this.show('warning', msg); }
}
