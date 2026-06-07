from rest_framework.permissions import BasePermission
from .models import User


class IsSuperAdmin(BasePermission):
    """Only platform-level Super Admin."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.Role.SUPER_ADMIN


class IsAdmin(BasePermission):
    """Company Admin OR Super Admin."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            User.Role.SUPER_ADMIN, User.Role.ADMIN
        ]


class IsAdminOrManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            User.Role.SUPER_ADMIN, User.Role.ADMIN, User.Role.MANAGER
        ]


class IsAdminOrManagerOrReceptionist(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            User.Role.SUPER_ADMIN, User.Role.ADMIN, User.Role.MANAGER, User.Role.RECEPTIONIST
        ]
