from celery import shared_task


@shared_task
def check_low_stock_alerts():
    """Email manager about products below minimum stock threshold."""
    from django.core.mail import send_mail
    from django.conf import settings
    from .models import Product

    low_stock = Product.objects.filter(
        stock_qty__lte=models.F('min_stock_threshold'),
        is_active=True
    )
    if low_stock.exists():
        items = '\n'.join([f'- {p.name}: {p.stock_qty} left (min: {p.min_stock_threshold})' for p in low_stock])
        send_mail(
            subject='[Saloon] Low Stock Alert',
            message=f'The following products are running low:\n\n{items}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.DEFAULT_FROM_EMAIL],
        )
    return f'{low_stock.count()} low-stock items found'
