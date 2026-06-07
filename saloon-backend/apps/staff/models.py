from django.db import models
from django.contrib.postgres.fields import ArrayField


class StaffProfile(models.Model):
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='staff_profiles')
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE, related_name='staff_profile')
    phone = models.CharField(max_length=20, blank=True)
    specialisations = ArrayField(models.CharField(max_length=100), blank=True, default=list)
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    bio = models.TextField(blank=True)
    profile_photo = models.ImageField(upload_to='staff/', null=True, blank=True)
    hired_date = models.DateField(null=True, blank=True)
    is_bookable = models.BooleanField(default=True)

    class Meta:
        db_table = 'staff_profiles'

    def __str__(self):
        return f'{self.user.full_name} (Staff)'


class WorkSchedule(models.Model):
    class DayOfWeek(models.IntegerChoices):
        MONDAY = 0
        TUESDAY = 1
        WEDNESDAY = 2
        THURSDAY = 3
        FRIDAY = 4
        SATURDAY = 5
        SUNDAY = 6

    staff = models.ForeignKey(StaffProfile, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.IntegerField(choices=DayOfWeek.choices)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_off = models.BooleanField(default=False)

    class Meta:
        db_table = 'work_schedules'
        unique_together = ['staff', 'day_of_week']
        ordering = ['day_of_week']


class Attendance(models.Model):
    staff = models.ForeignKey(StaffProfile, on_delete=models.CASCADE, related_name='attendance_records')
    clock_in = models.DateTimeField()
    clock_out = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'attendance'
        ordering = ['-clock_in']

    @property
    def hours_worked(self):
        if self.clock_out:
            delta = self.clock_out - self.clock_in
            return round(delta.total_seconds() / 3600, 2)
        return None
