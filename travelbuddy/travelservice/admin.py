from django.contrib import admin
from .models import CustomUser, Trip

# Register your models here.
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'password', 'user_id')
    search_fields = ('username', 'email', 'password', 'user_id')

class TripAdmin(admin.ModelAdmin):
    list_display = ('trip_id', 'user_id', 'trip_name', 'location', 'latitude', 'longitude', 
                    'proposed_date', 'start_date', 'end_date', 'weather_forcast', 'interests', 'users_interested')
    search_fields = ('trip_id', 'user_id', 'trip_name', 'location', 'latitude', 'longitude', 
                    'proposed_date', 'start_date', 'end_date', 'weather_forcast', 'interests', 'users_interested')
    readonly_fields = ('trip_id', 'location', 'proposed_date')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Trip, TripAdmin)