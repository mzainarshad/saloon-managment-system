import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PosService } from '../../core/services/pos.service';
import { ProductsService } from '../../core/services/products.service';
import { ServicesService } from '../../core/services/services.service';
import { CustomersService } from '../../core/services/customers.service';
import { StaffService } from '../../core/services/staff.service';
import { NotificationService } from '../../core/services/notification.service';
import { SaleItem } from '../../core/models';
import { ReplacePipe } from '../../shared/pipes/replace.pipe';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterLink, ReplacePipe],
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss'],
})
export class PosComponent implements OnInit {
  // Data
  services: any[] = [];
  products: any[] = [];
  customers: any[] = [];
  staff: any[] = [];

  // Cart
  cartItems: (SaleItem & { _id?: number })[] = [];
  selectedCustomer: any = null;
  selectedStaff: any = null;
  paymentMethod = 'cash';
  discountPercent = 0;
  discountAmount = 0;
  taxPercent = 0;
  notes = '';

  // UI State
  activeTab: 'services' | 'products' = 'services';
  searchTerm = '';
  loading = false;
  submitting = false;
  receiptSale: any = null;
  showReceipt = false;

  paymentMethods = ['cash', 'card', 'online', 'gift_card', 'loyalty'];

  constructor(
    private pos: PosService,
    private productsSvc: ProductsService,
    private servicesSvc: ServicesService,
    private customersSvc: CustomersService,
    private staffSvc: StaffService,
    private notify: NotificationService
  ) { }

  ngOnInit() {
    this.servicesSvc.getAll({ page_size: 200, is_active: true }).subscribe((r: any) => this.services = r.results || r);
    this.productsSvc.getAll({ page_size: 200, is_active: true }).subscribe((r: any) => this.products = r.results || r);
    this.customersSvc.getAll({ page_size: 500 }).subscribe((r: any) => this.customers = r.results || r);
    this.staffSvc.getAll({ page_size: 100 }).subscribe((r: any) => this.staff = r.results || r);
  }

  get filteredItems(): any[] {
    const list = this.activeTab === 'services' ? this.services : this.products;
    if (!this.searchTerm) return list;
    return list.filter(i => i.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  addToCart(item: any, type: 'service' | 'product') {
    const price = type === 'service' ? item.price : item.retail_price;
    const existing = this.cartItems.find(c => c.item_id === item.id && c.item_type === type);
    if (existing) {
      existing.quantity++;
      existing.total_price = existing.unit_price * existing.quantity;
    } else {
      this.cartItems.push({ _id: Date.now(), item_type: type, item_id: item.id, item_name: item.name, quantity: 1, unit_price: price, total_price: price });
    }
  }

  removeItem(item: any) { this.cartItems = this.cartItems.filter(c => c._id !== item._id); }
  updateQty(item: SaleItem & { _id?: number }, qty: number) {
    if (qty < 1) { this.removeItem(item); return; }
    item.quantity = qty;
    item.total_price = item.unit_price * qty;
  }

  get subtotal(): number { return this.cartItems.reduce((s, i) => s + i.unit_price * i.quantity, 0); }
  get computedDiscount(): number {
    if (this.discountPercent > 0) return this.subtotal * this.discountPercent / 100;
    return this.discountAmount;
  }
  get taxAmount(): number { return (this.subtotal - this.computedDiscount) * this.taxPercent / 100; }
  get total(): number { return this.subtotal - this.computedDiscount + this.taxAmount; }

  checkout() {
    if (!this.cartItems.length) { this.notify.warning('Cart is empty'); return; }
    this.submitting = true;
    const payload = {
      client: this.selectedCustomer?.id || null,
      staff: this.selectedStaff?.id || null,
      payment_method: this.paymentMethod,
      discount_percent: this.discountPercent,
      discount_amount: this.discountAmount,
      tax_percent: this.taxPercent,
      notes: this.notes,
      items: this.cartItems.map(({ _id, ...rest }) => ({
        item_type: rest.item_type,
        item_id: rest.item_id,
        item_name: rest.item_name,
        quantity: rest.quantity,
        unit_price: rest.unit_price,
        total_price: rest.unit_price * rest.quantity,
      })),
    };
    this.pos.createSale(payload).subscribe({
      next: (sale) => {
        this.submitting = false;
        this.receiptSale = sale;
        this.showReceipt = true;
        this.notify.success(`Sale #${sale.id} completed — Rs.${sale.total_amount}`);
        this.clearCart();
      },
      error: (e) => { this.submitting = false; this.notify.error(e?.error?.detail || 'Failed to process sale'); },
    });
  }

  clearCart() {
    this.cartItems = [];
    this.selectedCustomer = null;
    this.selectedStaff = null;
    this.discountPercent = 0;
    this.discountAmount = 0;
    this.taxPercent = 0;
    this.notes = '';
  }

  getStaffName(s: any): string { return s.name || `${s.user?.first_name || ''} ${s.user?.last_name || ''}`.trim(); }
  compareById(a: any, b: any): boolean { return a?.id === b?.id; }
  closeReceipt() { this.showReceipt = false; this.receiptSale = null; }
}
