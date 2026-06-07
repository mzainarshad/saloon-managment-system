from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.common.mixins import TenantQuerySetMixin
from .models import Campaign
from .serializers import CampaignSerializer
from .tasks import send_campaign
from apps.accounts.permissions import IsAdminOrManager


class CampaignViewSet(TenantQuerySetMixin, viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [IsAdminOrManager]

    def perform_create(self, serializer):
        user = self.request.user
        company = user.company if not user.is_super_admin else serializer.validated_data.get('company', user.company)
        serializer.save(created_by=user, company=company)

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        campaign = self.get_object()
        if campaign.status not in ['draft', 'scheduled']:
            return Response({'detail': 'Campaign already sent or cancelled.'}, status=400)
        send_campaign.delay(campaign.id)
        return Response({'detail': 'Campaign queued for sending.'})
