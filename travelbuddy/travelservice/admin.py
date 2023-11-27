from django.contrib import admin
from .models import CustomUser, Trip

# Register your models here.
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'user_id')
    search_fields = ('username', 'email', 'user_id')
    readonly_fields = ('user_id',)

class TripAdmin(admin.ModelAdmin):
    list_display = ('trip_id', 'user_id', 'location', 'proposed_date', 'start_date', 'end_date', 'weather_forcast')
    search_fields = ('trip_id', 'user_id', 'location', 'proposed_date', 'start_date', 'end_date', 'weather_forcast')
    readonly_fields = ('trip_id', 'proposed_date')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Trip, TripAdmin)