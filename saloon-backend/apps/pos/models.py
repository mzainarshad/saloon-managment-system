from django.db import models


class Sale(models.Model):
    class PaymentMethod(models.TextChoices):
        CASH = 'cash', 'Cash'
        CARD = 'card', 'Card'
        ONLINE = 'online', 'Online Transfer'
        GIFT_CARD = 'gift_card', 'Gift Card'
        LOYALTY = 'loyalty', 'Loyalty Points'
        SPLIT = 'split', 'Split Payment'

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        COMPLETED = 'completed', 'Completed'
        REFUNDED = 'refunded', 'Refunded'
        VOIDED = 'voided', 'Voided'

    client = models.ForeignKey('customers.Client', on_delete=models.SET_NULL, null=True, related_name='sales')
    staff = models.ForeignKey('staff.StaffProfile', on_delete=models.SET_NULL, null=True, related_name='sales')
    appointment = models.OneToOneField('appointments.Appointment', null=True, blank=True, on_delete=models.SET_NULL, related_name='sale')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    tax_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.COMPLETED)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey('accounts.User', null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sales'
        ordering = ['-created_at']

    def __str__(self):
        return f'Sale #{self.id} - {self.client} - Rs.{self.total_amount}'


class SaleItem(models.Model):
    class ItemType(models.TextChoices):
        SERVICE = 'service', 'Service'
        PRODUCT = 'product', 'Product'
        PACKAGE = 'package', 'Package'
        GIFT_CARD = 'gift_card', 'Gift Card'

    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    item_type = models.CharField(max_length=20, choices=ItemType.choices)
    item_id = models.PositiveIntegerField()
    item_name = models.CharField(max_length=200)  # snapshot at sale time
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'sale_items'


class Payment(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='payments')
    method = models.CharField(max_length=20, choices=Sale.PaymentMethod.choices)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reference = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'payments'
