from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from .models import Appointment, AppointmentStatusHistory


class AppointmentStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentStatusHistory
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    staff_name = serializers.CharField(source='staff.user.full_name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    service_price = serializers.DecimalField(source='service.price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'reminder_sent', 'end_time']

    def validate(self, data):
        start = data.get('start_time')
        service = data.get('service')

        # Auto-calculate end_time from service duration
        if start and service:
            data['end_time'] = start + timedelta(minutes=service.duration_minutes)

        end = data.get('end_time')

        # Check staff availability
        staff = data.get('staff')
        if staff and start and end:
            conflict = Appointment.objects.filter(
                staff=staff,
                start_time__lt=end,
                end_time__gt=start,
                status__in=['pending', 'confirmed', 'in_progress']
            ).exclude(pk=self.instance.pk if self.instance else None)
            if conflict.exists():
                raise serializers.ValidationError('Staff has a conflicting appointment at this time.')
        return data


class AppointmentDetailSerializer(AppointmentSerializer):
    status_history = AppointmentStatusHistorySerializer(many=True, read_only=True)


class AppointmentStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Appointment.Status.choices)
    notes = serializers.CharField(required=False, allow_blank=True)