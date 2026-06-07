from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Appointment, AppointmentStatusHistory
from .serializers import (
    AppointmentSerializer, AppointmentDetailSerializer,
    AppointmentStatusUpdateSerializer
)


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related('client', 'staff__user', 'service')
    search_fields = ['client__name', 'client__phone', 'staff__user__first_name']
    filterset_fields = ['status', 'staff', 'service']
    ordering_fields = ['start_time', 'created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AppointmentDetailSerializer
        return AppointmentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        date = self.request.query_params.get('date')
        if date:
            qs = qs.filter(start_time__date=date)
        staff_id = self.request.query_params.get('staff_id')
        if staff_id:
            qs = qs.filter(staff_id=staff_id)
        return qs

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        appointment = self.get_object()
        serializer = AppointmentStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_status = appointment.status
        new_status = serializer.validated_data['status']

        AppointmentStatusHistory.objects.create(
            appointment=appointment,
            old_status=old_status,
            new_status=new_status,
            changed_by=request.user,
            notes=serializer.validated_data.get('notes', '')
        )
        appointment.status = new_status
        appointment.save()
        return Response(AppointmentSerializer(appointment).data)

    @action(detail=False, methods=['get'])
    def today(self, request):
        today = timezone.localdate()
        appointments = self.get_queryset().filter(start_time__date=today)
        return Response(AppointmentSerializer(appointments, many=True).data)

    @action(detail=False, methods=['get'])
    def available_slots(self, request):
        """Return available time slots for a given staff/date/service."""
        from datetime import datetime, timedelta, time
        staff_id = request.query_params.get('staff_id')
        date_str = request.query_params.get('date')
        duration = int(request.query_params.get('duration', 60))

        if not staff_id or not date_str:
            return Response({'detail': 'staff_id and date are required.'}, status=400)

        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        booked = Appointment.objects.filter(
            staff_id=staff_id,
            start_time__date=date,
            status__in=['pending', 'confirmed', 'in_progress']
        ).values_list('start_time', 'end_time')

        slots = []
        slot_start = datetime.combine(date, time(9, 0))
        end_of_day = datetime.combine(date, time(20, 0))

        while slot_start + timedelta(minutes=duration) <= end_of_day:
            slot_end = slot_start + timedelta(minutes=duration)
            conflict = any(s < slot_end and e > slot_start for s, e in
                           [(b[0].replace(tzinfo=None), b[1].replace(tzinfo=None)) for b in booked])
            if not conflict:
                slots.append({'start': slot_start.isoformat(), 'end': slot_end.isoformat()})
            slot_start += timedelta(minutes=30)

        return Response(slots)
