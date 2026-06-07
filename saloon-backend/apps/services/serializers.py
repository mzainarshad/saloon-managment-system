from rest_framework import serializers
from .models import ServiceCategory, Service, Package, GiftCard


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = '__all__'
        read_only_fields = ['company']


class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ['company']


class PackageSerializer(serializers.ModelSerializer):
    services_detail = ServiceSerializer(source='services', many=True, read_only=True)

    class Meta:
        model = Package
        fields = '__all__'
        read_only_fields = ['company']


class GiftCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiftCard
        fields = '__all__'
        read_only_fields = ['remaining_value', 'status', 'created_at', 'company']