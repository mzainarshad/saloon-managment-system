import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { CustomersService } from '../../../core/services/customers.service';
import { StaffService } from '../../../core/services/staff.service';
import { ServicesService } from '../../../core/services/services.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
})
export class AppointmentFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  saving = false;
  isEdit = false;
  appointmentId?: number;
  customers: any[] = [];
  staff: any[] = [];
  services: any[] = [];
  statuses = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svc: AppointmentsService,
    private customerSvc: CustomersService,
    private staffSvc: StaffService,
    private servicesSvc: ServicesService,
    private notify: NotificationService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      client: ['', Validators.required],
      staff: ['', Validators.required],
      service: ['', Validators.required],
      start_time: ['', Validators.required],
      status: ['pending'],
      notes: [''],
    });
    this.loadData();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEdit = true; this.appointmentId = +id; this.loadAppointment(+id); }
  }

  loadData() {
    this.customerSvc.getAll({ page_size: 500 }).subscribe((r: any) => this.customers = r.results || r);
    this.staffSvc.getAll({ page_size: 100 }).subscribe((r: any) => this.staff = r.results || r);
    this.servicesSvc.getAll({ page_size: 200 }).subscribe((r: any) => this.services = r.results || r);
  }

  loadAppointment(id: number) {
    this.loading = true;
    this.svc.getById(id).subscribe({
      next: (a) => {
        this.form.patchValue({ ...a, start_time: a.start_time?.slice(0, 16) });
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const obs = this.isEdit
      ? this.svc.update(this.appointmentId!, this.form.value)
      : this.svc.create(this.form.value);
    obs.subscribe({
      next: () => { this.notify.success(this.isEdit ? 'Updated!' : 'Created!'); this.router.navigate(['/appointments']); },
      error: (e) => { this.saving = false; this.notify.error(e?.error?.detail || 'Failed to save'); },
    });
  }
}
