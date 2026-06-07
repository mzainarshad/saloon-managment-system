# SalonPro — Angular Frontend

Complete Angular 17 frontend for the Salon Management System.  
Backend: Django REST Framework · Database: PostgreSQL  
Platform: pos.orangelogs.com

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 17 (Standalone Components) |
| UI | Angular Material 17 + custom SCSS design system |
| Charts | ng2-charts v5 + Chart.js |
| HTTP | Angular HttpClient with JWT interceptor |
| Forms | Reactive Forms + Template-driven |
| Routing | Lazy-loaded feature routes + Guards |
| State | Service-based + BehaviorSubject |

---

## Project Structure

```
src/app/
├── core/
│   ├── services/         # API services (auth, customers, staff, POS, etc.)
│   ├── guards/           # authGuard, guestGuard
│   ├── interceptors/     # JWT auth interceptor with refresh
│   └── models/           # TypeScript interfaces
├── shared/
│   ├── components/
│   │   └── layout/       # Sidebar + header layout
│   └── pipes/            # ReplacePipe
└── modules/              # Lazy-loaded feature modules
    ├── auth/             # Login page
    ├── dashboard/        # KPIs, charts, alerts
    ├── appointments/     # List + form
    ├── customers/        # List + form
    ├── staff/            # List + form
    ├── services/         # List + form + categories
    ├── products/         # Inventory list + form
    ├── pos/              # Full point-of-sale terminal
    ├── reports/          # Sales, staff, service reports
    ├── marketing/        # Placeholder (admin panel)
    └── settings/         # Profile + password
```

---

## Setup & Run

### Prerequisites
- Node.js 18+
- Angular CLI 17

### 1. Install dependencies
```bash
cd saloon-frontend
npm install
```

### 2. Configure API URL
Edit `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',  // Your Django backend URL
};
```

For production, edit `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://pos.orangelogs.com/api',
};
```

### 3. Start development server
```bash
npm start
# or
npx ng serve
```
Open: http://localhost:4200

### 4. Build for production
```bash
npm run build
# or
npx ng build --configuration=production
```
Output: `dist/saloon-frontend/`

---

## Backend Requirements

Ensure the Django backend is running with:
- CORS configured to allow `http://localhost:4200`
- JWT auth at `/api/auth/login/`
- All API endpoints from `config/urls.py`

### CORS setup (Django)
```python
# settings/base.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "https://your-frontend-domain.com",
]
```

---

## Default Login

Use the Django superuser credentials you created during backend setup.

---

## Modules & Features

| Module | Routes | Features |
|---|---|---|
| Auth | /auth/login | JWT login, token refresh, logout |
| Dashboard | /dashboard | KPI cards, sales trend chart, payment pie, top services, low stock alerts, today's appointments |
| Appointments | /appointments | CRUD, status management, pagination, filters |
| Customers | /customers | CRUD, loyalty points display, visit history |
| Staff | /staff | CRUD, specialisations, commission rate |
| Services | /services | CRUD, categories management |
| Products | /products | CRUD, low stock filter, SKU |
| POS | /pos | Cart, service/product selector, discounts, tax, payment methods, receipt modal |
| Sales Report | /reports/sales | Date filters, status/payment filters, today's summary |
| Staff Report | /reports/staff | Commission earned by staff |
| Services Report | /reports/services | Popularity ranking |
| Settings | /settings | Profile edit, password change |

---

## Design System

Black & white premium theme with clean minimal aesthetics. All CSS variables defined in `src/styles.scss`:

```scss
--color-bg: #f8f8f8
--color-surface: #ffffff
--color-primary: #111111
--color-text: #111111
--sidebar-width: 220px
--header-height: 60px
```

---

## Deployment (Vercel)

1. Build: `npm run build`
2. Deploy `dist/saloon-frontend/browser/` to Vercel
3. Add `vercel.json` for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

