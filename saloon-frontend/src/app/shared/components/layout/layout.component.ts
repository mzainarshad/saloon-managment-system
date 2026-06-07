import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: { label: string; route: string }[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, MatIconModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  currentUser: User | null = null;
  sidebarOpen = true;
  expandedMenu: string | null = null;
  mobileOpen = false;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'POS', icon: 'point_of_sale', route: '/pos' },
    {
      label: 'Appointments', icon: 'event', children: [
        { label: 'All Appointments', route: '/appointments' },
        { label: 'New Appointment', route: '/appointments/new' },
        { label: 'Calendar', route: '/appointments/calendar' },
      ]
    },
    {
      label: 'Services', icon: 'content_cut', children: [
        { label: 'All Services', route: '/services' },
        { label: 'Categories', route: '/services/categories' },
      ]
    },
    {
      label: 'Sales', icon: 'receipt_long', children: [
        { label: 'Sale History', route: '/reports/sales' },
      ]
    },
    {
      label: 'Products', icon: 'inventory_2', children: [
        { label: 'All Products', route: '/products' },
        { label: 'Add Product', route: '/products/new' },
      ]
    },
    { label: 'Customers', icon: 'group', route: '/customers' },
    { label: 'Staff', icon: 'badge', route: '/staff' },
    {
      label: 'Reports', icon: 'bar_chart', children: [
        { label: 'Sales Report', route: '/reports/sales' },
        { label: 'Staff Commission', route: '/reports/staff' },
        { label: 'Service Popularity', route: '/reports/services' },
      ]
    },
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(u => this.currentUser = u);
  }

  toggleMenu(label: string) {
    this.expandedMenu = this.expandedMenu === label ? null : label;
  }

  isActive(item: NavItem): boolean {
    if (item.route) return this.router.url.startsWith(item.route);
    return item.children?.some(c => this.router.url.startsWith(c.route)) ?? false;
  }

  logout() { this.auth.logout(); }
  getInitials(user: User | null): string {
    if (!user) return '?';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  }
}
