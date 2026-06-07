from rest_framework import serializers
from django.db import transaction
from .models import Sale, SaleItem, Payment
from apps.customers.models import Client, LoyaltyTransaction
from apps.inventory.models import Product, StockMovement


class SaleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleItem
        fields = '__all__'
        read_only_fields = ['sale']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['sale', 'created_at']


class SaleCreateSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)
    payments = PaymentSerializer(many=True, required=False)

    class Meta:
        model = Sale
        fields = ['client', 'staff', 'appointment', 'discount_amount', 'discount_percent',
                  'tax_percent', 'payment_method', 'notes', 'items', 'payments']

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        payments_data = validated_data.pop('payments', [])

        discount_amount = validated_data.pop('discount_amount', 0) or 0
        discount_percent = validated_data.pop('discount_percent', 0) or 0
        tax_percent = validated_data.pop('tax_percent', 0) or 0

        subtotal = sum(item['unit_price'] * item['quantity'] for item in items_data)
        if discount_percent:
            discount_amount = subtotal * discount_percent / 100
        tax_base = subtotal - discount_amount
        tax_amount = tax_base * tax_percent / 100
        total = tax_base + tax_amount

        for item in items_data:
            item['total_price'] = item['unit_price'] * item['quantity']

        # created_by and company come from perform_create via validated_data
        sale = Sale.objects.create(
            **validated_data,
            subtotal=subtotal,
            discount_percent=discount_percent,
            discount_amount=discount_amount,
            tax_percent=tax_percent,
            tax_amount=tax_amount,
            total_amount=total,
        )

        for item_data in items_data:
            SaleItem.objects.create(sale=sale, **item_data)
            if item_data['item_type'] == 'product':
                try:
                    product = Product.objects.get(pk=item_data['item_id'])
                    product.stock_qty -= item_data['quantity']
                    product.save()
                    StockMovement.objects.create(
                        product=product,
                        movement_type='sale',
                        qty=-item_data['quantity'],
                        reason=f'Sale #{sale.id}'
                    )
                except Product.DoesNotExist:
                    pass

        for payment_data in payments_data:
            Payment.objects.create(sale=sale, **payment_data)

        if sale.client:
            points_earned = int(total / 10)
            if points_earned > 0:
                sale.client.loyalty_points += points_earned
                sale.client.save()
                LoyaltyTransaction.objects.create(
                    client=sale.client,
                    points=points_earned,
                    transaction_type='earn',
                    reference=f'Sale #{sale.id}'
                )

        return sale

class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    client_name = serializers.CharField(source='client.name', read_only=True)
    staff_name = serializers.CharField(source='staff.user.full_name', read_only=True)

    class Meta:
        model = Sale
        fields = '__all__'
        read_only_fields = ['company']