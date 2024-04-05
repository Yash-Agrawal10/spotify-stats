from django.contrib import admin
from .models import SpotifyToken, OAuthState

# Register your models here.
class SpotifyTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'scope', 'expires_in')
    search_fields = ('user', 'scope')
    
admin.site.register(SpotifyToken, SpotifyTokenAdmin)

class OAuthStateAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    search_fields = ('user',)

admin.site.register(OAuthState, OAuthStateAdmin)