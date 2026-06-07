from django.contrib import admin
from .models import Appointment, AppointmentStatusHistory


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['client', 'staff', 'service', 'start_time', 'status']
    list_filter = ['status', 'source']
    search_fields = ['client__name', 'client__phone']
    date_hierarchy = 'start_time'


@admin.register(AppointmentStatusHistory)
class AppointmentStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ['appointment', 'old_status', 'new_status', 'changed_by', 'changed_at']
    readonly_fields = ['changed_at']
