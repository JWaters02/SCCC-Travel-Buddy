from django.contrib.auth import authenticate
from django.core.validators import EmailValidator
from rest_framework import serializers
import logging
from .models import CustomUser, Trip
from .utils import get_uuid, get_weather, get_location

logger = logging.getLogger(__name__)

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'password2', 'user_id']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        if not validated_data['username']:
            raise serializers.ValidationError({'username': 'Username cannot be empty.'})
        if not validated_data['email']:
            raise serializers.ValidationError({'email': 'Email cannot be empty.'})
        if not validated_data['password']:
            raise serializers.ValidationError({'password': 'Password cannot be empty.'})

        password = validated_data['password']
        password2 = validated_data.pop('password2')
        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        
        user_id = get_uuid()
        if user_id is None:
            raise ValueError("Unable to generate UUID for user_id")
        
        user = CustomUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            user_id=user_id
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user is None:
            raise serializers.ValidationError("Invalid username or password.")
        return {'user': user}

class UserListSerializer(serializers.Serializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'user_id']

    def get(self, validated_data):
        return CustomUser.objects.create(**validated_data)

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ['trip_id', 'user_id', 'trip_name', 'location', 'latitude', 'longitude', 'proposed_date', 'start_date', 'end_date', 'weather_forcast', 'interests']

    def create(self, validated_data):
        trip_id = get_uuid()
        if trip_id is None:
            raise ValueError("Unable to generate UUID for trip_id")
        
        location = get_location(validated_data['latitude'], validated_data['longitude'])
        if location is None:
            logger.error(f"Unable to retrieve location data for {validated_data['latitude']}, {validated_data['longitude']}")
            location = f"{validated_data['latitude']}, {validated_data['longitude']}"
        
        weather = get_weather(validated_data['latitude'], validated_data['longitude'], validated_data['start_date'], validated_data['end_date'])
        if weather is None:
            logger.error(f"Unable to retrieve weather data for {validated_data['latitude']}, {validated_data['longitude']}")
            raise ValueError("Unable to retrieve weather data")
        
        validated_data['trip_id'] = trip_id
        validated_data['location'] = location
        validated_data['weather_forcast'] = weather
        return Trip.objects.create(**validated_data)