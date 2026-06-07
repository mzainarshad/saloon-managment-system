import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
@Component({ selector:'app-marketing', standalone:true, imports:[CommonModule, MatIconModule],
  template:`
  <div class="page-header"><div><h1>Marketing</h1><p>SMS & Email Campaigns</p></div></div>
  <div class="card"><div class="empty-state" style="padding:60px 0;">
    <mat-icon>campaign</mat-icon>
    <p>Marketing campaigns are coming soon. Manage them via the admin panel for now.</p>
    <a href="/admin/marketing" target="_blank" class="btn btn-secondary" style="margin-top:12px;">Open Admin Panel</a>
  </div></div>` })
export class MarketingComponent {}
