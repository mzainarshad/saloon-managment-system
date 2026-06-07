from django.urls import path
from .views import (
    SalesReportView, StaffCommissionReportView,
    ServicePopularityReportView, DashboardKPIView, SalesExportCSVView
)

urlpatterns = [
    path('kpi/', DashboardKPIView.as_view(), name='dashboard_kpi'),
    path('sales/', SalesReportView.as_view(), name='sales_report'),
    path('staff-commission/', StaffCommissionReportView.as_view(), name='staff_commission'),
    path('service-popularity/', ServicePopularityReportView.as_view(), name='service_popularity'),
    path('sales/export/', SalesExportCSVView.as_view(), name='sales_export'),
]
