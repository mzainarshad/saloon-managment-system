from rest_framework import serializers
from .models import Client, ClientNote, LoyaltyTransaction


class ClientNoteSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)

    class Meta:
        model = ClientNote
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at', 'updated_at']


class LoyaltyTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoyaltyTransaction
        fields = '__all__'
        read_only_fields = ['created_at']


class ClientSerializer(serializers.ModelSerializer):
    total_visits = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = '__all__'
        read_only_fields = ['loyalty_points', 'created_at', 'updated_at', 'company']

    def get_total_visits(self, obj):
        return obj.appointments.filter(status='completed').count()


class ClientDetailSerializer(ClientSerializer):
    client_notes = ClientNoteSerializer(many=True, read_only=True)
    loyalty_transactions = LoyaltyTransactionSerializer(many=True, read_only=True)