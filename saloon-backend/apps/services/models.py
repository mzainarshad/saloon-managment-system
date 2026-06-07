from django.db import models
from django.contrib.postgres.fields import ArrayField


class ServiceCategory(models.Model):
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='service_categories')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    sort_order = models.IntegerField(default=0)

    class Meta:
        db_table = 'service_categories'
        ordering = ['sort_order', 'name']
        unique_together = [('company', 'name')]

    def __str__(self):
        return self.name


class Service(models.Model):
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=200)
    category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True, related_name='services')
    description = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'services'
        ordering = ['category', 'name']

    def __str__(self):
        return f'{self.name} - Rs.{self.price}'


class Package(models.Model):
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='packages')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    services = models.ManyToManyField(Service, related_name='packages')
    total_sessions = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    validity_days = models.PositiveIntegerField(default=90)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'packages'

    def __str__(self):
        return self.name


class GiftCard(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        USED = 'used', 'Fully Used'
        EXPIRED = 'expired', 'Expired'

    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='gift_cards')
    code = models.CharField(max_length=20)
    initial_value = models.DecimalField(max_digits=10, decimal_places=2)
    remaining_value = models.DecimalField(max_digits=10, decimal_places=2)
    client = models.ForeignKey('customers.Client', null=True, blank=True, on_delete=models.SET_NULL, related_name='gift_cards')
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    expiry_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'gift_cards'
        unique_together = [('company', 'code')]

    def __str__(self):
        return f'{self.code} - Rs.{self.remaining_value} remaining'
