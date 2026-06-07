from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Supplier, ProductCategory, Product, StockMovement, PurchaseOrder
from .serializers import (SupplierSerializer, ProductCategorySerializer, ProductSerializer,
                           StockMovementSerializer, PurchaseOrderSerializer)
from apps.accounts.permissions import IsAdminOrManager


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category', 'supplier')
    serializer_class = ProductSerializer
    search_fields = ['name', 'sku']
    filterset_fields = ['category', 'is_active']

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        from django.db.models import F
        products = Product.objects.filter(stock_qty__lte=F('min_stock_threshold'), is_active=True)
        return Response(ProductSerializer(products, many=True).data)


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.select_related('supplier').prefetch_related('items')
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAdminOrManager]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

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
                created_by=request.user
            )
        order.status = 'received'
        order.received_at = timezone.now()
        order.save()
        return Response({'detail': 'Purchase order received and stock updated.'})


class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.select_related('product')
    serializer_class = StockMovementSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
