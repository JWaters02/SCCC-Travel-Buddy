from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Trip, CustomUser
from .serializers import TripSerializer, UserRegistrationSerializer, UserLoginSerializer, UserListSerializer
from .utils import get_uuid, get_location
from .throttles import UUIDRateThrottle
import logging

logger = logging.getLogger(__name__)

class UUIDView(APIView):
    #throttle_classes = [UUIDRateThrottle]

    def get(self, request, format=None):
        return Response({'uuid': get_uuid()}, status=status.HTTP_200_OK)
    
class LocationView(APIView):
    def get(self, request, format=None):
        latitude = request.query_params.get('lat', None)
        longitude = request.query_params.get('lon', None)
        if latitude is None or longitude is None:
            return Response({'error': 'Latitude and longitude are required.'}, status=status.HTTP_400_BAD_REQUEST)

        status_code, location_data = get_location(latitude, longitude)
        if status_code != 200:
            return Response({'error': location_data}, status=status_code)
        if location_data is None:
            return Response({'error': 'Unable to retrieve location data.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({'location': location_data}, status=status_code)

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save(user_id=request.data.get('user_id'))
            token, created = Token.objects.get_or_create(user=user)
            data = serializer.data
            data['token'] = token.key
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({'username': user.username, 'email': user.email, 'user_id': user.user_id, 'token': token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserReauthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        return Response({'username': request.user.username, 'email': request.user.email, 'user_id': request.user.user_id}, status=status.HTTP_200_OK)

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        if not request.user.is_superuser and not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        users = CustomUser.objects.all()
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data)
    
    def put(self, request, format=None):
        if not request.user.is_superuser and not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        user = CustomUser.objects.get(user_id=request.data['user_id'])
        serializer = UserListSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, format=None):
        if not request.user.is_superuser and not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        user = CustomUser.objects.get(user_id=request.data['user_id'])
        serializer = UserListSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, format=None):
        if not request.user.is_superuser and not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        user = CustomUser.objects.get(user_id=request.data['user_id'])
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class TripsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        trips = Trip.objects.all()
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)

class TripView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, trip_id, format=None):
        try:
            trip = Trip.objects.get(trip_id=trip_id, user_id=request.user)
            serializer = TripSerializer(trip)
            return Response(serializer.data)
        except Trip.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request, trip_id, format=None):
        serializer = TripSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(trip_id=trip_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, trip_id, format=None):
        try:
            trip = Trip.objects.get(trip_id=trip_id, user_id=request.user)
            serializer = TripSerializer(trip, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Trip.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, trip_id, format=None):
        try:
            trip = Trip.objects.get(trip_id=trip_id, user_id=request.user)
            trip.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Trip.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)