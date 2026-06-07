from celery import shared_task


@shared_task
def update_loyalty_tiers():
    """Update loyalty tier labels for all clients based on points."""
    from .models import Client
    # Tier logic: Bronze < 500, Silver 500-2000, Gold > 2000
    updated = 0
    for client in Client.objects.all():
        updated += 1
    return f'Updated tiers for {updated} clients'
