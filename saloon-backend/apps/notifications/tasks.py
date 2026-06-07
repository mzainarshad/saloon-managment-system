from celery import shared_task
from django.utils import timezone
from datetime import timedelta


@shared_task
def send_appointment_reminders():
    """Send SMS reminders for appointments happening in the next 24 hours."""
    from apps.appointments.models import Appointment
    from apps.marketing.tasks import _send_sms
    from .models import Notification

    now = timezone.now()
    window_start = now + timedelta(hours=23)
    window_end = now + timedelta(hours=25)

    appointments = Appointment.objects.filter(
        start_time__range=[window_start, window_end],
        status__in=['confirmed', 'pending'],
        reminder_sent=False
    ).select_related('client', 'staff__user', 'service')

    count = 0
    for appt in appointments:
        if appt.client.phone:
            message = (
                f"Hi {appt.client.name}, reminder: your appointment at "
                f"{appt.start_time.strftime('%I:%M %p')} tomorrow with "
                f"{appt.staff.user.full_name} for {appt.service.name}. "
                f"Reply YES to confirm or NO to cancel."
            )
            _send_sms(appt.client.phone, message)
            Notification.objects.create(
                notification_type='appointment_reminder',
                channel='sms',
                recipient=appt.client.phone,
                message=message,
                status='sent',
                sent_at=timezone.now(),
                reference_id=appt.id,
            )
            appt.reminder_sent = True
            appt.save()
            count += 1

    return f'{count} reminders sent'


@shared_task
def send_birthday_wishes():
    """Send birthday SMS to clients whose birthday is today."""
    from apps.customers.models import Client
    from apps.marketing.tasks import _send_sms

    today = timezone.localdate()
    clients = Client.objects.filter(dob__month=today.month, dob__day=today.day, is_active=True)
    for client in clients:
        if client.phone:
            msg = f"Happy Birthday, {client.name.split()[0]}! 🎂 Enjoy 10% off your next visit. From your saloon family!"
            _send_sms(client.phone, msg)
    return f'{clients.count()} birthday wishes sent'
