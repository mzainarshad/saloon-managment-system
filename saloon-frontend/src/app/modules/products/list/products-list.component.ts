import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../core/services/products.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, FormsModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  search = '';
  lowStockOnly = false;

  constructor(private svc: ProductsService, private notify: NotificationService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: any = { page_size: 200 };
    if (this.search) params.search = this.search;
    this.svc.getAll(params).subscribe({
      next: (r: any) => {
        let items = r.results || r;
        if (this.lowStockOnly) items = items.filter((p: Product) => p.stock_qty < (p.min_stock_threshold || 5));
        this.products = items;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  delete(p: Product) {
    if (!confirm(`Delete ${p.name}?`)) return;
    this.svc.delete(p.id).subscribe({
      next: () => { this.products = this.products.filter(x => x.id !== p.id); this.notify.success('Deleted'); },
      error: () => this.notify.error('Failed'),
    });
  }

  isLowStock(p: Product): boolean { return p.stock_qty < (p.min_stock_threshold || 5); }
}
