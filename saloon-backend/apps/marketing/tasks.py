from celery import shared_task


@shared_task
def send_campaign(campaign_id):
    from .models import Campaign
    from apps.customers.models import Client
    from django.utils import timezone

    campaign = Campaign.objects.get(pk=campaign_id)
    campaign.status = 'sending'
    campaign.save()

    # Filter audience
    clients = Client.objects.filter(is_active=True)
    if campaign.audience_tags:
        from django.contrib.postgres.expressions import ArrayOverlap
        clients = clients.filter(tags__overlap=campaign.audience_tags)

    count = 0
    for client in clients:
        if campaign.channel in ['sms', 'both'] and client.phone:
            _send_sms(client.phone, campaign.message)
            count += 1
        if campaign.channel in ['email', 'both'] and client.email:
            _send_email(client.email, campaign.subject, campaign.message)

    campaign.status = 'sent'
    campaign.sent_at = timezone.now()
    campaign.total_recipients = count
    campaign.save()
    return f'Campaign {campaign_id} sent to {count} recipients'


def _send_sms(phone, message):
    from django.conf import settings
    try:
        from twilio.rest import Client as TwilioClient
        client = TwilioClient(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(body=message, from_=settings.TWILIO_PHONE_NUMBER, to=phone)
    except Exception as e:
        print(f'SMS failed to {phone}: {e}')


def _send_email(to_email, subject, body):
    from django.core.mail import send_mail
    from django.conf import settings
    try:
        send_mail(subject or 'Message from your saloon', body, settings.DEFAULT_FROM_EMAIL, [to_email])
    except Exception as e:
        print(f'Email failed to {to_email}: {e}')
