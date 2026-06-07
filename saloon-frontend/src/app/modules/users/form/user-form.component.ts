import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../core/services/users.service';
import { CompaniesService } from '../../../core/services/companies.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Company } from '../../../core/models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  saving = false;
  isEdit = false;
  userId?: number;
  companies: Company[] = [];

  /** Roles available — super_admin can assign any; company admin cannot assign super_admin */
  get availableRoles() {
    const all = [
      { value: 'admin', label: 'Company Admin' },
      { value: 'manager', label: 'Manager' },
      { value: 'stylist', label: 'Stylist' },
      { value: 'receptionist', label: 'Receptionist' },
      { value: 'cashier', label: 'Cashier' },
    ];
    return this.auth.isSuperAdmin
      ? [{ value: 'super_admin', label: 'Super Admin' }, ...all]
      : all;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svc: UsersService,
    private companiesSvc: CompaniesService,
    private notify: NotificationService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['admin', Validators.required],
      company: [this.auth.isSuperAdmin ? null : this.auth.companyId, this.auth.isSuperAdmin ? Validators.required : null],
      is_active: [true],
      password: [''],
      password2: [''],
    });

    if (this.auth.isSuperAdmin) {
      this.loadCompanies();
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.userId = +id;
      // Remove required validators from password fields for edit
      this.form.get('password')!.clearValidators();
      this.form.get('password2')!.clearValidators();
      this.form.get('password')!.updateValueAndValidity();
      this.form.get('password2')!.updateValueAndValidity();
      this.load(+id);
    } else {
      // Password required for create
      this.form.get('password')!.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password2')!.setValidators(Validators.required);
      this.form.get('password')!.updateValueAndValidity();
      this.form.get('password2')!.updateValueAndValidity();
    }
  }

  loadCompanies() {
    this.companiesSvc.getAll({ page_size: 200 }).subscribe({
      next: (r: any) => { this.companies = r.results || r; },
    });
  }

  load(id: number) {
    this.loading = true;
    this.svc.getById(id).subscribe({
      next: u => {
        this.form.patchValue({
          first_name: u.first_name,
          last_name: u.last_name,
          email: u.email,
          role: u.role,
          company: u.company,
          is_active: u.is_active,
        });
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;

    if (!this.isEdit && v.password !== v.password2) {
      this.notify.error('Passwords do not match');
      return;
    }

    this.saving = true;
    let data: any = {
      first_name: v.first_name,
      last_name: v.last_name,
      email: v.email,
      role: v.role,
      is_active: v.is_active,
    };

    // Only include company if super admin
    if (this.auth.isSuperAdmin) {
      data.company = v.company || null;
    }

    let obs;
    if (this.isEdit) {
      obs = this.svc.update(this.userId!, data);
    } else {
      obs = this.svc.create({ ...data, password: v.password, password2: v.password2 });
    }

    obs.subscribe({
      next: () => {
        this.notify.success(this.isEdit ? 'User updated!' : 'User created!');
        this.router.navigate(['/users']);
      },
      error: (e: any) => {
        this.saving = false;
        const err = e?.error;
        const msg = err?.detail || err?.email?.[0] || err?.password?.[0] || err?.non_field_errors?.[0] || 'Failed to save';
        this.notify.error(msg);
      },
    });
  }
}
