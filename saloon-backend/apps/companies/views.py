from rest_framework import viewsets
from .models import Company
from .serializers import CompanySerializer
from apps.accounts.permissions import IsSuperAdmin


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsSuperAdmin]
    search_fields = ['name', 'email']
    filterset_fields = ['is_active']
