import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CompaniesService } from '../../../core/services/companies.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Company } from '../../../core/models';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss'],
})
export class CompaniesListComponent implements OnInit {
  companies: Company[] = [];
  loading = true;

  constructor(private svc: CompaniesService, private notify: NotificationService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getAll({ page_size: 100 }).subscribe({
      next: (r: any) => { this.companies = r.results || r; this.loading = false; },
      error: () => this.loading = false,
    });
  }

  toggleActive(c: Company) {
    this.svc.toggleActive(c.id, !c.is_active).subscribe({
      next: updated => {
        c.is_active = updated.is_active;
        this.notify.success(updated.is_active ? 'Company activated' : 'Company deactivated');
      },
      error: () => this.notify.error('Failed to update status'),
    });
  }

  delete(c: Company) {
    if (!confirm(`Delete company "${c.name}"? This is irreversible.`)) return;
    this.svc.delete(c.id).subscribe({
      next: () => { this.companies = this.companies.filter(x => x.id !== c.id); this.notify.success('Deleted'); },
      error: () => this.notify.error('Failed to delete'),
    });
  }
}
