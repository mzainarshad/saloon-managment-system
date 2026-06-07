import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService, Toast } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <router-outlet></router-outlet>
    <div class="toast-container">
      <div *ngFor="let toast of toasts" class="toast toast-{{toast.type}}" (click)="dismiss(toast.id)">
        <span class="toast-icon">{{getIcon(toast.type)}}</span>
        <span>{{toast.message}}</span>
      </div>
    </div>
  `,
  styles: [`
    .toast-container { position:fixed; top:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:8px; }
    .toast { display:flex; align-items:center; gap:10px; padding:12px 18px; border-radius:8px; font-size:14px; font-weight:500; cursor:pointer; min-width:260px; animation:slideIn .3s ease; box-shadow:0 4px 20px rgba(0,0,0,.15); }
    .toast-success { background:#1a1a1a; color:#fff; border-left:3px solid #22c55e; }
    .toast-error { background:#1a1a1a; color:#fff; border-left:3px solid #ef4444; }
    .toast-info { background:#1a1a1a; color:#fff; border-left:3px solid #3b82f6; }
    .toast-warning { background:#1a1a1a; color:#fff; border-left:3px solid #f59e0b; }
    .toast-icon { font-size:16px; }
    @keyframes slideIn { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
  `]
})
export class AppComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private notify: NotificationService) {}

  ngOnInit() {
    this.notify.toasts.subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => this.dismiss(toast.id), 4000);
    });
  }

  dismiss(id: number) { this.toasts = this.toasts.filter(t => t.id !== id); }
  getIcon(type: string): string {
    return { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' }[type] || '•';
  }
}
