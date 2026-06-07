import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  saving = false;
  savingPw = false;
  currentUser: User | null = null;
  activeTab: 'profile' | 'password' | 'business' = 'profile';

  constructor(private fb: FormBuilder, private auth: AuthService, private notify: NotificationService) {}

  ngOnInit() {
    this.currentUser = this.auth.currentUser;
    this.profileForm = this.fb.group({
      first_name: [this.currentUser?.first_name || '', Validators.required],
      last_name: [this.currentUser?.last_name || '', Validators.required],
      email: [{ value: this.currentUser?.email || '', disabled: true }],
    });
    this.passwordForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required],
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) return;
    this.saving = true;
    this.auth.updateProfile(this.profileForm.value).subscribe({
      next: () => { this.saving = false; this.notify.success('Profile updated!'); },
      error: () => { this.saving = false; this.notify.error('Failed to update'); },
    });
  }

  changePassword() {
    const v = this.passwordForm.value;
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    if (v.new_password !== v.confirm_password) { this.notify.error('Passwords do not match'); return; }
    this.savingPw = true;
    this.auth.changePassword({ old_password: v.old_password, new_password: v.new_password }).subscribe({
      next: () => { this.savingPw = false; this.passwordForm.reset(); this.notify.success('Password changed!'); },
      error: (e) => { this.savingPw = false; this.notify.error(e?.error?.detail || 'Failed'); },
    });
  }

  get roleLabel(): string {
    const labels: Record<string, string> = { admin: 'Administrator', manager: 'Manager', stylist: 'Stylist', receptionist: 'Receptionist', cashier: 'Cashier' };
    return labels[this.currentUser?.role || ''] || this.currentUser?.role || '';
  }
}
