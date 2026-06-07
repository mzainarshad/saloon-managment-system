from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, ClientNoteViewSet

router = DefaultRouter()
router.register('', ClientViewSet, basename='client')
router.register('notes', ClientNoteViewSet, basename='client-note')

urlpatterns = [path('', include(router.urls))]
