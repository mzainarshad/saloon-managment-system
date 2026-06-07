from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from apps.common.mixins import TenantQuerySetMixin
from .models import Sale, SaleItem
from .serializers import SaleSerializer, SaleCreateSerializer


class SaleViewSet(TenantQuerySetMixin, viewsets.ModelViewSet):
    queryset = Sale.objects.select_related('client', 'staff__user').prefetch_related('items', 'payments')
    search_fields = ['client__name', 'client__phone']
    filterset_fields = ['status', 'payment_method', 'staff']
    ordering_fields = ['created_at', 'total_amount']

    def get_serializer_class(self):
        if self.action == 'create':
            return SaleCreateSerializer
        return SaleSerializer

    def perform_create(self, serializer):
        user = self.request.user
        company = user.company if not user.is_super_admin else serializer.validated_data.get('company', user.company)
        serializer.save(created_by=user, company=company)

    @action(detail=True, methods=['get'])
    def receipt(self, request, pk=None):
        sale = self.get_object()
        return Response(SaleSerializer(sale).data)

    @action(detail=False, methods=['get'])
    def today_summary(self, request):
        today = timezone.localdate()
        qs = self.get_queryset()
        sales = qs.filter(created_at__date=today, status='completed')
        summary = sales.aggregate(
            total_revenue=Sum('total_amount'),
            total_sales=Count('id'),
        )
        summary['by_payment'] = list(
            sales.values('payment_method').annotate(amount=Sum('total_amount'), count=Count('id'))
        )
        return Response(summary)
