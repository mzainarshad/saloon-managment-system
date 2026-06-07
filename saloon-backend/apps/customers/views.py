from rest_framework import generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Client, ClientNote, LoyaltyTransaction
from .serializers import ClientSerializer, ClientDetailSerializer, ClientNoteSerializer, LoyaltyTransactionSerializer


class ClientViewSet(ModelViewSet):
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
    queryset = ClientNote.objects.all()
    serializer_class = ClientNoteSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
