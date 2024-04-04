from django.contrib import admin
from .models import SpotifyToken

# Register your models here.
class SpotifyTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'scope', 'expires_in', 'created_at')
    search_fields = ('user', 'scope')
    
admin.site.register(SpotifyToken, SpotifyTokenAdmin)