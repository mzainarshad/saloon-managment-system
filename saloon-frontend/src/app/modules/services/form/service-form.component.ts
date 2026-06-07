import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from '../../../core/services/services.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss'],
})
export class ServiceFormComponent implements OnInit {
  form!: FormGroup;
  loading = false; saving = false; isEdit = false; serviceId?: number;
  categories: any[] = [];
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private svc: ServicesService, private notify: NotificationService) {}
  ngOnInit() {
    this.form = this.fb.group({ name: ['', Validators.required], category: [''], duration_minutes: [30, Validators.required], price: [0, Validators.required], description: [''], is_active: [true] });
    this.svc.getCategories().subscribe((r: any) => this.categories = r.results || r);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEdit = true; this.serviceId = +id; this.loading = true; this.svc.getById(+id).subscribe({ next: s => { this.form.patchValue(s); this.loading = false; }, error: () => this.loading = false }); }
  }
  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const obs = this.isEdit ? this.svc.update(this.serviceId!, this.form.value) : this.svc.create(this.form.value);
    obs.subscribe({ next: () => { this.notify.success(this.isEdit ? 'Updated!' : 'Created!'); this.router.navigate(['/services']); }, error: (e) => { this.saving = false; this.notify.error(e?.error?.detail || 'Failed'); } });
  }
}
