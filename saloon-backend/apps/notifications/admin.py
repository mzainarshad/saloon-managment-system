from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['notification_type', 'channel', 'recipient', 'status', 'sent_at']
    list_filter = ['notification_type', 'channel', 'status']
