import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../../core/services/products.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  loading = false; saving = false; isEdit = false; productId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svc: ProductsService,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      sku: [''],
      cost_price: [0, [Validators.required, Validators.min(0)]],
      retail_price: [0, [Validators.required, Validators.min(0)]],
      stock_qty: [0, Validators.min(0)],
      min_stock_threshold: [5],
      is_active: [true],
      description: [''],
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true; this.productId = +id; this.loading = true;
      this.svc.getById(+id).subscribe({ next: p => { this.form.patchValue(p); this.loading = false; }, error: () => this.loading = false });
    }
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const obs = this.isEdit ? this.svc.update(this.productId!, this.form.value) : this.svc.create(this.form.value);
    obs.subscribe({
      next: () => { this.notify.success(this.isEdit ? 'Updated!' : 'Product added!'); this.router.navigate(['/products']); },
      error: (e) => { this.saving = false; this.notify.error(e?.error?.detail || 'Failed to save'); },
    });
  }
}
