import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ServicesService } from '../../../core/services/services.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-service-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatIconModule],
  templateUrl: './service-categories.component.html',
  styleUrls: ['./service-categories.component.scss'],
})
export class ServiceCategoriesComponent implements OnInit {
  categories: any[] = [];
  loading = true;
  newName = '';
  adding = false;
  constructor(private svc: ServicesService, private notify: NotificationService) {}
  ngOnInit() { this.load(); }
  load() { this.loading = true; this.svc.getCategories().subscribe({ next: (r: any) => { this.categories = r.results || r; this.loading = false; }, error: () => this.loading = false }); }
  add() {
    if (!this.newName.trim()) return;
    this.adding = true;
    this.svc.createCategory({ name: this.newName.trim() }).subscribe({ next: (c) => { this.categories.push(c); this.newName = ''; this.adding = false; this.notify.success('Category added'); }, error: () => { this.adding = false; this.notify.error('Failed'); } });
  }
}
