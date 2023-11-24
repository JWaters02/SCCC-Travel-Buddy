from django.db import models
from django.contrib.auth.models import AbstractUser
from .utils import get_uuid

class CustomUser(AbstractUser):
    external_user_id = models.UUIDField(editable=False, unique=True, default=get_uuid())

class Trip(models.Model):
    trip_id = models.UUIDField(editable=False, unique=True)
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    location = models.CharField(max_length=100)
    proposed_date = models.DateTimeField(auto_now_add=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    weather_forcast = models.TextField(blank=True)