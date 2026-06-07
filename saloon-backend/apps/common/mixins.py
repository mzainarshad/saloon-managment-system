"""
apps/common/mixins.py
Reusable helpers for multi-tenant filtering.
"""
from django.db import models


class TenantModelMixin(models.Model):
    """Add this as a mixin to every tenant-specific model."""
    company = models.ForeignKey(
        'companies.Company',
        on_delete=models.CASCADE,
        related_name='+',
    )

    class Meta:
        abstract = True


class TenantQuerySetMixin:
    """
    ViewSet / View mixin that automatically scopes querysets to the
    logged-in user's company.  Super Admins see everything.
    """

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_super_admin:
            return qs
        return qs.filter(company=user.company)

    def perform_create(self, serializer):
        user = self.request.user
        company = user.company if not user.is_super_admin else serializer.validated_data.get('company', user.company)
        serializer.save(company=company)
