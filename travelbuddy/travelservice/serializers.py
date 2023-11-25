from rest_framework import serializers
from .models import CustomUser, Trip
from .utils import get_uuid

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'password2', 'user_id']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data['password']
        password2 = validated_data.pop('password2')
        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        
        user_id = get_uuid()
        if user_id is None:
            raise ValueError("Unable to generate UUID for user_id")
        else:
            validated_data['user_id'] = user_id
            return CustomUser.objects.create(**validated_data)
        
class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'user_id']

    def create(self, validated_data):
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