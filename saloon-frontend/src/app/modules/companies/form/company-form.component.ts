import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompaniesService } from '../../../core/services/companies.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss'],
})
export class CompanyFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  saving = false;
  isEdit = false;
  companyId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svc: CompaniesService,
    private notify: NotificationService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      email: ['', Validators.email],
      phone: [''],
      address: [''],
      is_active: [true],
    });

    // Auto-generate slug from name
    this.form.get('name')!.valueChanges.subscribe(val => {
      if (!this.isEdit) {
        const slug = (val || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        this.form.get('slug')!.setValue(slug, { emitEvent: false });
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEdit = true; this.companyId = +id; this.load(+id); }
  }

  load(id: number) {
    this.loading = true;
    this.svc.getById(id).subscribe({
      next: c => { this.form.patchValue(c); this.loading = false; },
      error: () => this.loading = false,
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const obs = this.isEdit
      ? this.svc.update(this.companyId!, this.form.value)
      : this.svc.create(this.form.value);
    obs.subscribe({
      next: () => {
        this.notify.success(this.isEdit ? 'Company updated!' : 'Company created!');
        this.router.navigate(['/companies']);
      },
      error: (e: any) => {
        this.saving = false;
        const msg = e?.error?.detail || e?.error?.name?.[0] || e?.error?.slug?.[0] || 'Failed to save';
        this.notify.error(msg);
      },
    });
  }
}
