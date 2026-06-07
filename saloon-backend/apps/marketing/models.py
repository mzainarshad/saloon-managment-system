from django.db import models
from django.contrib.postgres.fields import ArrayField


class Campaign(models.Model):
    class Channel(models.TextChoices):
        SMS = 'sms', 'SMS'
        EMAIL = 'email', 'Email'
        BOTH = 'both', 'SMS + Email'

    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        SCHEDULED = 'scheduled', 'Scheduled'
        SENDING = 'sending', 'Sending'
        SENT = 'sent', 'Sent'
        CANCELLED = 'cancelled', 'Cancelled'

    name = models.CharField(max_length=200)
    subject = models.CharField(max_length=200, blank=True)  # for email
    message = models.TextField()
    channel = models.CharField(max_length=10, choices=Channel.choices, default=Channel.SMS)
    audience_tags = ArrayField(models.CharField(max_length=50), blank=True, default=list)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    total_recipients = models.IntegerField(default=0)
    created_by = models.ForeignKey('accounts.User', null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'campaigns'
        ordering = ['-created_at']

    def __str__(self):
        return self.name
