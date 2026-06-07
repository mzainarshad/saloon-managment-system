from django.contrib import admin
from .models import Campaign


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ['name', 'channel', 'status', 'total_recipients', 'created_at']
    list_filter = ['channel', 'status']
