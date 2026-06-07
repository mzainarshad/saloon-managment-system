from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, PurchaseOrderViewSet, StockMovementViewSet

router = DefaultRouter()
router.register('products', ProductViewSet, basename='product')
router.register('purchase-orders', PurchaseOrderViewSet, basename='purchase-order')
router.register('stock-movements', StockMovementViewSet, basename='stock-movement')

urlpatterns = [path('', include(router.urls))]
