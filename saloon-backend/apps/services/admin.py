from django.contrib import admin
from .models import ServiceCategory, Service, Package, GiftCard


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'sort_order']
    ordering = ['sort_order']


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'duration_minutes', 'price', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['name']


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'total_sessions', 'validity_days', 'is_active']
    filter_horizontal = ['services']


@admin.register(GiftCard)
class GiftCardAdmin(admin.ModelAdmin):
    list_display = ['code', 'initial_value', 'remaining_value', 'status', 'expiry_date']
