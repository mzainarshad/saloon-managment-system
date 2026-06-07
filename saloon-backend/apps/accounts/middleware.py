import json
from .models import AuditLog


class AuditLogMiddleware:
    WRITE_METHODS = {'POST', 'PUT', 'PATCH', 'DELETE'}

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.method in self.WRITE_METHODS and request.path.startswith('/api/'):
            try:
                payload = json.loads(request.body) if request.body else None
            except Exception:
                payload = None
            AuditLog.objects.create(
                user=request.user if request.user.is_authenticated else None,
                method=request.method,
                endpoint=request.path,
                payload=payload,
                response_code=response.status_code,
                ip_address=request.META.get('REMOTE_ADDR'),
            )
        return response
