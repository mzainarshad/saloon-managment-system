from django.contrib import admin
from .models import Client, ClientNote, LoyaltyTransaction


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'loyalty_points', 'created_at']
    search_fields = ['name', 'phone', 'email']
    list_filter = ['gender', 'is_active']


@admin.register(ClientNote)
class ClientNoteAdmin(admin.ModelAdmin):
    list_display = ['client', 'note_type', 'created_by', 'created_at']


@admin.register(LoyaltyTransaction)
class LoyaltyTransactionAdmin(admin.ModelAdmin):
    list_display = ['client', 'points', 'transaction_type', 'created_at']
