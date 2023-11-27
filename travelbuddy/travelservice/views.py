from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from .models import Trip, CustomUser
from .serializers import TripSerializer, UserRegistrationSerializer, UserLoginSerializer, UserListSerializer
import logging

logger = logging.getLogger(__name__)

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        logger.info(f"UserRegistrationView: {request.data}")
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            data = serializer.data
            data['token'] = token.key
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        logger.info(f"UserLoginView: {request.data}")
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        users = CustomUser.objects.all()
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data)
    
class UserDelete(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, format=None):
        user = CustomUser.objects.get(user_id=request.data['user_id'])
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class TripList(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        trips = Trip.objects.all()
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = TripSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)