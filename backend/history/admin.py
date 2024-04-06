from django.contrib import admin
from .models import Track, History, Artist

# Register your models here.
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class TrackArtistInline(admin.TabularInline):
    model = Track.artists.through
    
class TrackAdmin(admin.ModelAdmin):
    list_display = ('title', 'get_artists', 'album',)
    inlines = (TrackArtistInline,)
    search_fields = ('title', 'artist', 'album',)

    def get_artists(self, obj):
        return ', '.join([artist.name for artist in obj.artists.all()])
    get_artists.short_description = 'Artists'

class HistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'track', 'played_at',)
    search_fields = ('user__email', 'track__title', 'track__artists', 'track__album',)

admin.site.register(Artist, ArtistAdmin)
admin.site.register(Track, TrackAdmin)
admin.site.register(History, HistoryAdmin)