from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceCategoryViewSet, ServiceViewSet, PackageViewSet, GiftCardViewSet

router = DefaultRouter()
router.register('categories', ServiceCategoryViewSet, basename='service-category')
router.register('packages', PackageViewSet, basename='package')
router.register('gift-cards', GiftCardViewSet, basename='gift-card')
router.register('', ServiceViewSet, basename='service')

urlpatterns = [path('', include(router.urls))]
