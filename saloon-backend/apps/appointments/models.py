from django.db import models
from django.utils import timezone


class Appointment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'
        NO_SHOW = 'no_show', 'No Show'

    class Source(models.TextChoices):
        WALK_IN = 'walk_in', 'Walk-in'
        PHONE = 'phone', 'Phone'
        ONLINE = 'online', 'Online Booking'
        APP = 'app', 'App'

    client = models.ForeignKey('customers.Client', on_delete=models.CASCADE, related_name='appointments')
    staff = models.ForeignKey('staff.StaffProfile', on_delete=models.SET_NULL, null=True, related_name='appointments')
    service = models.ForeignKey('services.Service', on_delete=models.SET_NULL, null=True, related_name='appointments')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    source = models.CharField(max_length=20, choices=Source.choices, default=Source.WALK_IN)
    notes = models.TextField(blank=True)
    reminder_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'appointments'
        ordering = ['start_time']

    def __str__(self):
        return f'{self.client} with {self.staff} on {self.start_time:%d %b %Y %H:%M}'


class AppointmentStatusHistory(models.Model):
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='status_history')
    old_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey('accounts.User', null=True, on_delete=models.SET_NULL)
    changed_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'appointment_status_history'
        ordering = ['-changed_at']
