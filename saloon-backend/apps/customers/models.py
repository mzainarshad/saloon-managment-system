from django.db import models
from django.contrib.postgres.fields import ArrayField


class Client(models.Model):
    class Gender(models.TextChoices):
        MALE = 'male', 'Male'
        FEMALE = 'female', 'Female'
        OTHER = 'other', 'Other'
        PREFER_NOT_TO_SAY = 'prefer_not_to_say', 'Prefer not to say'

    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='clients')
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=Gender.choices, blank=True)
    loyalty_points = models.IntegerField(default=0)
    tags = ArrayField(models.CharField(max_length=50), blank=True, default=list)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'clients'
        ordering = ['name']
        # phone unique per company (not globally)
        unique_together = [('company', 'phone')]

    def __str__(self):
        return f'{self.name} ({self.phone})'


class ClientNote(models.Model):
    class NoteType(models.TextChoices):
        FORMULA = 'formula', 'Color Formula'
        GENERAL = 'general', 'General'
        ALLERGY = 'allergy', 'Allergy'
        PREFERENCE = 'preference', 'Preference'

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='client_notes')
    note_type = models.CharField(max_length=20, choices=NoteType.choices, default=NoteType.GENERAL)
    content = models.JSONField()
    created_by = models.ForeignKey('accounts.User', null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'client_notes'
        ordering = ['-created_at']


class LoyaltyTransaction(models.Model):
    class TransactionType(models.TextChoices):
        EARN = 'earn', 'Earn'
        REDEEM = 'redeem', 'Redeem'
        ADJUST = 'adjust', 'Manual Adjustment'
        EXPIRE = 'expire', 'Expired'

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='loyalty_transactions')
    points = models.IntegerField()
    transaction_type = models.CharField(max_length=20, choices=TransactionType.choices)
    reference = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'loyalty_transactions'
        ordering = ['-created_at']
