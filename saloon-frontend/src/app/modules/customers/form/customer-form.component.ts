import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../../../core/services/customers.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
})
export class CustomerFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  saving = false;
  isEdit = false;
  customerId?: number;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private svc: CustomersService, private notify: NotificationService) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.email],
      date_of_birth: [''],
      gender: [''],
      notes: [''],
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEdit = true; this.customerId = +id; this.loadCustomer(+id); }
  }

  loadCustomer(id: number) {
    this.loading = true;
    this.svc.getById(id).subscribe({ next: (c) => { this.form.patchValue(c); this.loading = false; }, error: () => this.loading = false });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const obs = this.isEdit ? this.svc.update(this.customerId!, this.form.value) : this.svc.create(this.form.value);
    obs.subscribe({
      next: () => { this.notify.success(this.isEdit ? 'Updated!' : 'Created!'); this.router.navigate(['/customers']); },
      error: (e) => { this.saving = false; this.notify.error(e?.error?.detail || 'Failed'); },
    });
  }
}
