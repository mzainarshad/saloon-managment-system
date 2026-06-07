from rest_framework.viewsets import ModelViewSet
from .models import ServiceCategory, Service, Package, GiftCard
from .serializers import ServiceCategorySerializer, ServiceSerializer, PackageSerializer, GiftCardSerializer


class ServiceCategoryViewSet(ModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer


class ServiceViewSet(ModelViewSet):
    queryset = Service.objects.filter(is_active=True).select_related('category')
    serializer_class = ServiceSerializer
    search_fields = ['name', 'category__name']
    filterset_fields = ['category', 'is_active']


class PackageViewSet(ModelViewSet):
    queryset = Package.objects.filter(is_active=True).prefetch_related('services')
    serializer_class = PackageSerializer


class GiftCardViewSet(ModelViewSet):
    queryset = GiftCard.objects.all()
    serializer_class = GiftCardSerializer
    search_fields = ['code', 'client__name', 'client__phone']
