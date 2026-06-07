from django.contrib import admin
from .models import Supplier, ProductCategory, Product, StockMovement, PurchaseOrder, PurchaseOrderItem


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'sku', 'category', 'stock_qty', 'retail_price', 'is_low_stock']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'sku']


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'supplier', 'status', 'total_cost', 'created_at']


admin.site.register(Supplier)
admin.site.register(ProductCategory)
admin.site.register(StockMovement)
