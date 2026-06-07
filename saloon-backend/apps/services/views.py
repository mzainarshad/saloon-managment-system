from rest_framework.viewsets import ModelViewSet
from apps.common.mixins import TenantQuerySetMixin
from .models import ServiceCategory, Service, Package, GiftCard
from .serializers import ServiceCategorySerializer, ServiceSerializer, PackageSerializer, GiftCardSerializer


class ServiceCategoryViewSet(TenantQuerySetMixin, ModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer


class ServiceViewSet(TenantQuerySetMixin, ModelViewSet):
    queryset = Service.objects.select_related('category')
    serializer_class = ServiceSerializer
    search_fields = ['name', 'category__name']
    filterset_fields = ['category', 'is_active']

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(is_active=True)


class PackageViewSet(TenantQuerySetMixin, ModelViewSet):
    queryset = Package.objects.prefetch_related('services')
    serializer_class = PackageSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(is_active=True)


class GiftCardViewSet(TenantQuerySetMixin, ModelViewSet):
    queryset = GiftCard.objects.all()
    serializer_class = GiftCardSerializer
    search_fields = ['code', 'client__name', 'client__phone']
