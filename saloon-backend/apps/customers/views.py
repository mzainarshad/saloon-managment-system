from rest_framework import generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from apps.common.mixins import TenantQuerySetMixin
from .models import Client, ClientNote, LoyaltyTransaction
from .serializers import ClientSerializer, ClientDetailSerializer, ClientNoteSerializer, LoyaltyTransactionSerializer


class ClientViewSet(TenantQuerySetMixin, ModelViewSet):
    queryset = Client.objects.all()
    search_fields = ['name', 'phone', 'email', 'tags']
    ordering_fields = ['name', 'created_at', 'loyalty_points']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ClientDetailSerializer
        return ClientSerializer

    @action(detail=True, methods=['get'])
    def notes(self, request, pk=None):
        client = self.get_object()
        notes = ClientNote.objects.filter(client=client)
        return Response(ClientNoteSerializer(notes, many=True).data)

    @action(detail=True, methods=['get'])
    def loyalty(self, request, pk=None):
        client = self.get_object()
        txns = LoyaltyTransaction.objects.filter(client=client)
        return Response(LoyaltyTransactionSerializer(txns, many=True).data)


class ClientNoteViewSet(ModelViewSet):
    serializer_class = ClientNoteSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin:
            return ClientNote.objects.all()
        return ClientNote.objects.filter(client__company=user.company)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
