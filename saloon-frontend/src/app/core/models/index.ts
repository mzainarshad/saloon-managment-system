export interface Company {
  id: number;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  user_count?: number;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'manager' | 'stylist' | 'receptionist' | 'cashier';
  is_active: boolean;
  company: number | null;
  company_name?: string;
  is_super_admin?: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: User;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  date_of_birth?: string;
  gender?: string;
  loyalty_points: number;
  total_spent: number;
  visit_count: number;
  notes?: string;
  created_at: string;
}

export interface StaffProfile {
  id: number;
  user: User;
  name: string;
  phone?: string;
  specialisations?: string[];
  commission_rate?: number;
  is_active: boolean;
}

export interface ServiceCategory {
  id: number;
  name: string;
  description?: string;
}

export interface Service {
  id: number;
  name: string;
  category?: number;
  category_name?: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  description?: string;
}

export interface Appointment {
  id: number;
  client: number;
  client_name: string;
  staff: number;
  staff_name?: string;
  service: number;
  service_name?: string;
  start_time: string;
  end_time?: string;
  status: 'booked' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  sku?: string;
  category?: number;
  cost_price: number;
  retail_price: number;
  stock_qty: number;
  min_stock_threshold?: number;
  is_active: boolean;
}

export interface SaleItem {
  item_type: 'service' | 'product' | 'package' | 'gift_card';
  item_id: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price?: number;
}

export interface Sale {
  id: number;
  client: number;
  client_name?: string;
  staff: number;
  staff_name?: string;
  subtotal: number;
  discount_amount: number;
  discount_percent: number;
  tax_percent: number;
  tax_amount: number;
  total_amount: number;
  payment_method: string;
  status: string;
  items: SaleItem[];
  notes?: string;
  created_at: string;
}

export interface DashboardKPI {
  today_revenue: number;
  today_sales_count: number;
  today_appointments: number;
  pending_appointments: number;
  total_clients: number;
  total_customers: number;
  new_clients_today: number;
  monthly_sales: number;
  total_expenses: number;
  net_profit: number;
  sales_trend: { date: string; total: number; count: number }[];
  payment_distribution: { payment_method: string; amount: number }[];
  top_services: { service_name: string; count: number; revenue: number }[];
  low_stock_items: { name: string; stock_qty: number; min_stock_threshold: number }[];
  booked_appointments: { id: number; client_name: string; service_name: string; start_time: string; status: string }[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
