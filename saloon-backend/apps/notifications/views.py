from rest_framework import generics
from apps.common.mixins import TenantQuerySetMixin
from .models import Notification
from .serializers import NotificationSerializer
from apps.accounts.permissions import IsAdminOrManager


class NotificationListView(TenantQuerySetMixin, generics.ListAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAdminOrManager]
    filterset_fields = ['status', 'notification_type', 'channel']
