from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class CustomUser(AbstractUser):
    user_id = models.UUIDField(primary_key=True, editable=True, unique=True, default=uuid.uuid4)

class Trip(models.Model):
    trip_id = models.UUIDField(primary_key=True, editable=True, unique=True, default=uuid.uuid4)
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    trip_name = models.CharField(max_length=100, default='')
    location = models.CharField(max_length=100, default='')
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)
    proposed_date = models.DateTimeField(auto_now_add=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    weather_forcast = models.JSONField(blank=True, default=dict)
    interests = models.IntegerField(default=0)
    users_interested = models.JSONField(blank=True, default=list)

class UUIDCache(models.Model):
    uuid = models.UUIDField(unique=True)