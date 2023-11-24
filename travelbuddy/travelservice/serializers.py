from rest_framework import serializers
from .models import CustomUser, Trip
from .utils import get_uuid

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'external_user_id']

    def create(self, validated_data):
        external_user_id = get_uuid()
        if external_user_id is None:
            raise ValueError("Unable to generate UUID for external_user_id")
        else:
            validated_data['external_user_id'] = external_user_id
            return CustomUser.objects.create(**validated_data)

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ['trip_id', 'user_id', 'location', 'proposed_date', 'start_date', 'end_date', 'weather_forcast']

    def create(self, validated_data):
        trip_id = get_uuid()
        if trip_id is None:
            raise ValueError("Unable to generate UUID for trip_id")
        else:
            validated_data['trip_id'] = trip_id
            return Trip.objects.create(**validated_data)