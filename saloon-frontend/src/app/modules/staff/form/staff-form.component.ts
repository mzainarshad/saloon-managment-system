import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaffService } from '../../../core/services/staff.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-staff-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './staff-form.component.html',
  styleUrls: ['./staff-form.component.scss'],
})
export class StaffFormComponent implements OnInit {
  form!: FormGroup;
  loading = false; saving = false; isEdit = false; staffId?: number;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private svc: StaffService, private notify: NotificationService) {}
  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: [''],
      specialisations: [''],
      commission_rate: [0],
      is_active: [true],
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEdit = true; this.staffId = +id; this.load(+id); }
  }
  load(id: number) {
    this.loading = true;
    this.svc.getById(id).subscribe({ next: (s: any) => { this.form.patchValue({ ...s, ...s.user, specialisations: s.specialisations?.join(', ') }); this.loading = false; }, error: () => this.loading = false });
  }
  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const v = this.form.value;
    const data = { ...v, specialisations: v.specialisations ? v.specialisations.split(',').map((x: string) => x.trim()) : [] };
    const obs = this.isEdit ? this.svc.update(this.staffId!, data) : this.svc.create(data);
    obs.subscribe({
      next: () => { this.notify.success(this.isEdit ? 'Updated!' : 'Created!'); this.router.navigate(['/staff']); },
      error: (e) => { this.saving = false; this.notify.error(e?.error?.detail || 'Failed'); },
    });
  }
}
