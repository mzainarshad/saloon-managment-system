from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from apps.common.mixins import TenantQuerySetMixin
from .models import Supplier, ProductCategory, Product, StockMovement, PurchaseOrder
from .serializers import (SupplierSerializer, ProductCategorySerializer, ProductSerializer,
                           StockMovementSerializer, PurchaseOrderSerializer)
from apps.accounts.permissions import IsAdminOrManager


class SupplierViewSet(TenantQuerySetMixin, viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class ProductCategoryViewSet(TenantQuerySetMixin, viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer


class ProductViewSet(TenantQuerySetMixin, viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category', 'supplier')
    serializer_class = ProductSerializer
    search_fields = ['name', 'sku']
    filterset_fields = ['category', 'is_active']

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        from django.db.models import F
        qs = self.get_queryset().filter(stock_qty__lte=F('min_stock_threshold'), is_active=True)
        return Response(ProductSerializer(qs, many=True).data)


class PurchaseOrderViewSet(TenantQuerySetMixin, viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.select_related('supplier').prefetch_related('items')
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAdminOrManager]

    def perform_create(self, serializer):
        user = self.request.user
        company = user.company if not user.is_super_admin else serializer.validated_data.get('company', user.company)
        serializer.save(created_by=user, company=company)

    @action(detail=True, methods=['post'])
    def receive(self, request, pk=None):
        order = self.get_object()
        if order.status != 'ordered':
            return Response({'detail': 'Only ordered POs can be received.'}, status=400)
        for item in order.items.all():
            item.product.stock_qty += item.quantity
            item.product.save()
            StockMovement.objects.create(
                product=item.product,
                movement_type='purchase',
                qty=item.quantity,
                reason=f'PO #{order.id}',
                created_by=request.user,
            )
        order.status = 'received'
        order.received_at = timezone.now()
        order.save()
        return Response({'detail': 'Purchase order received and stock updated.'})


class StockMovementViewSet(viewsets.ModelViewSet):
    serializer_class = StockMovementSerializer

    def get_queryset(self):
        user = self.request.user
        qs = StockMovement.objects.select_related('product')
        if user.is_super_admin:
            return qs
        return qs.filter(product__company=user.company)

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)
