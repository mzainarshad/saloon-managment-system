from django.db import models


class Notification(models.Model):
    class NotificationType(models.TextChoices):
        APPOINTMENT_REMINDER = 'appointment_reminder', 'Appointment Reminder'
        APPOINTMENT_CONFIRMED = 'appointment_confirmed', 'Appointment Confirmed'
        POST_VISIT = 'post_visit', 'Post Visit Thank You'
        BIRTHDAY = 'birthday', 'Birthday'
        LOW_STOCK = 'low_stock', 'Low Stock Alert'
        CAMPAIGN = 'campaign', 'Campaign'

    class Channel(models.TextChoices):
        SMS = 'sms', 'SMS'
        EMAIL = 'email', 'Email'

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        SENT = 'sent', 'Sent'
        FAILED = 'failed', 'Failed'

    notification_type = models.CharField(max_length=40, choices=NotificationType.choices)
    channel = models.CharField(max_length=10, choices=Channel.choices)
    recipient = models.CharField(max_length=200)
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    error_message = models.TextField(blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    reference_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
