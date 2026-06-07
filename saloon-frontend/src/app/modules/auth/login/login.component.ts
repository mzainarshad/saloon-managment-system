import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  showPassword = false;
  error = '';

  constructor(private auth: AuthService, private router: Router, private notify: NotificationService) {}

  login() {
    if (!this.email || !this.password) { this.error = 'Please enter email and password.'; return; }
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => { this.notify.success('Welcome back!'); this.router.navigate(['/dashboard']); },
      error: (e) => { this.loading = false; this.error = e?.error?.detail || 'Invalid credentials. Please try again.'; }
    });
  }
}
