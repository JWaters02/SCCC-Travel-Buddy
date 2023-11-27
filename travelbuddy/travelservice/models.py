from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    user_id = models.UUIDField(primary_key=True, editable=True, unique=True, default='00000000-0000-0000-0000-000000000000')

class Trip(models.Model):
    trip_id = models.UUIDField(primary_key=True, editable=True, unique=True, default='00000000-0000-0000-0000-000000000000')
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    trip_name = models.CharField(max_length=100, default='')
    location = models.CharField(max_length=100)
    proposed_date = models.DateTimeField(auto_now_add=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    weather_forcast = models.TextField(blank=True, default='')