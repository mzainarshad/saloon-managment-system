from rest_framework import serializers
from apps.accounts.models import User
from .models import StaffProfile, WorkSchedule, Attendance


class WorkScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkSchedule
        fields = '__all__'


class AttendanceSerializer(serializers.ModelSerializer):
    hours_worked = serializers.ReadOnlyField()

    class Meta:
        model = Attendance
        fields = '__all__'


class StaffProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    schedules = WorkScheduleSerializer(many=True, read_only=True)

    # Write fields
    email = serializers.EmailField(write_only=True, required=False)
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)
    is_active = serializers.BooleanField(write_only=True, required=False, default=True)

    class Meta:
        model = StaffProfile
        fields = '__all__'

    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'email': obj.user.email,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'full_name': obj.user.full_name,
            'role': obj.user.role,
            'is_active': obj.user.is_active,
        }

    def create(self, validated_data):
        email = validated_data.pop('email', None)
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        is_active = validated_data.pop('is_active', True)

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'is_active': is_active,
                'role': User.Role.STYLIST,
            }
        )
        if created:
            user.set_password('Saloon@1234')
            user.save()

        return StaffProfile.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)
        email = validated_data.pop('email', None)
        is_active = validated_data.pop('is_active', None)

        user = instance.user
        if first_name: user.first_name = first_name
        if last_name: user.last_name = last_name
        if email: user.email = email
        if is_active is not None: user.is_active = is_active
        user.save()

        return super().update(instance, validated_data)