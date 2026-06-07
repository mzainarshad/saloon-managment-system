from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from apps.common.mixins import TenantQuerySetMixin
from .models import StaffProfile, WorkSchedule, Attendance
from .serializers import StaffProfileSerializer, WorkScheduleSerializer, AttendanceSerializer
from apps.accounts.permissions import IsAdminOrManager


class StaffViewSet(TenantQuerySetMixin, viewsets.ModelViewSet):
    queryset = StaffProfile.objects.select_related('user').prefetch_related('schedules')
    serializer_class = StaffProfileSerializer
    search_fields = ['user__first_name', 'user__last_name', 'specialisations']

    @action(detail=True, methods=['get', 'put'])
    def schedule(self, request, pk=None):
        staff = self.get_object()
        if request.method == 'GET':
            schedules = WorkSchedule.objects.filter(staff=staff)
            return Response(WorkScheduleSerializer(schedules, many=True).data)
        WorkSchedule.objects.filter(staff=staff).delete()
        for item in request.data:
            item['staff'] = staff.id
            s = WorkScheduleSerializer(data=item)
            s.is_valid(raise_exception=True)
            s.save()
        return Response({'detail': 'Schedule updated.'})

    @action(detail=True, methods=['post'])
    def clock_in(self, request, pk=None):
        staff = self.get_object()
        if Attendance.objects.filter(staff=staff, clock_out__isnull=True).exists():
            return Response({'detail': 'Already clocked in.'}, status=status.HTTP_400_BAD_REQUEST)
        attendance = Attendance.objects.create(staff=staff, clock_in=timezone.now())
        return Response(AttendanceSerializer(attendance).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def clock_out(self, request, pk=None):
        staff = self.get_object()
        attendance = Attendance.objects.filter(staff=staff, clock_out__isnull=True).first()
        if not attendance:
            return Response({'detail': 'Not clocked in.'}, status=status.HTTP_400_BAD_REQUEST)
        attendance.clock_out = timezone.now()
        attendance.save()
        return Response(AttendanceSerializer(attendance).data)

    @action(detail=True, methods=['get'])
    def attendance(self, request, pk=None):
        staff = self.get_object()
        records = Attendance.objects.filter(staff=staff)
        return Response(AttendanceSerializer(records, many=True).data)
