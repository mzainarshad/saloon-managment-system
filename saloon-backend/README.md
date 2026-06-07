# Saloon Management System — Backend

Django REST API backend for **pos.orangelogs.com**

**Stack:** Django 5 · DRF · PostgreSQL · Celery + Redis · JWT Auth

---

## Quick Start

### 1. Clone & setup environment

```bash
git clone <repo>
cd saloon-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Fill in your values
```

### 2. Start services (Docker)

```bash
docker-compose up db redis -d
```

### 3. Run migrations & create superuser

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 4. Start the dev server

```bash
python manage.py runserver
```

### 5. Start Celery workers (separate terminals)

```bash
celery -A celery_app worker -l INFO
celery -A celery_app beat -l INFO
```

---

## API Endpoints

| Module | Base URL |
|--------|----------|
| Auth | `/api/auth/` |
| Customers (CRM) | `/api/customers/` |
| Appointments | `/api/appointments/` |
| Point of Sale | `/api/pos/` |
| Services | `/api/services/` |
| Inventory | `/api/inventory/` |
| Staff | `/api/staff/` |
| Reports | `/api/reports/` |
| Marketing | `/api/marketing/` |
| Notifications | `/api/notifications/` |
| Django Admin | `/admin/` |

## Authentication

All endpoints (except login) require a `Bearer` JWT token:

```
Authorization: Bearer <access_token>
```

Get token via `POST /api/auth/login/` with `{ "email": "...", "password": "..." }`

Refresh via `POST /api/auth/refresh/` with `{ "refresh": "..." }`

---

## Project Structure

```
saloon-backend/
├── config/
│   ├── settings/
│   │   ├── base.py          # Shared settings
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py              # Root URL routing
│   └── wsgi.py
├── apps/
│   ├── accounts/            # Users, auth, audit logs
│   ├── customers/           # Client CRM, loyalty, notes
│   ├── appointments/        # Booking, calendar, status
│   ├── pos/                 # Point of sale, invoices
│   ├── services/            # Service catalogue, packages, gift cards
│   ├── inventory/           # Products, stock, purchase orders
│   ├── staff/               # Profiles, schedules, attendance
│   ├── reports/             # Analytics, CSV export, KPIs
│   ├── marketing/           # SMS/email campaigns
│   └── notifications/       # Reminders, alerts
├── celery_app.py            # Celery config
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

## Roles & Permissions

| Role | Access |
|------|--------|
| `admin` | Full access |
| `manager` | Most features, no user management |
| `stylist` | Own appointments, own sales, client CRM |
| `receptionist` | Appointments, client CRM |
| `cashier` | POS, basic reports |

## Deployment (Railway.app)

1. Push to GitHub
2. Connect Railway to your GitHub repo
3. Add all env variables from `.env.example`
4. Railway auto-detects Python/Django and deploys

Set `DATABASE_URL` from your Supabase project settings.
