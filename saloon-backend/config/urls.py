from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/customers/', include('apps.customers.urls')),
    path('api/appointments/', include('apps.appointments.urls')),
    path('api/pos/', include('apps.pos.urls')),
    path('api/services/', include('apps.services.urls')),
    path('api/inventory/', include('apps.inventory.urls')),
    path('api/staff/', include('apps.staff.urls')),
    path('api/reports/', include('apps.reports.urls')),
    path('api/marketing/', include('apps.marketing.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
