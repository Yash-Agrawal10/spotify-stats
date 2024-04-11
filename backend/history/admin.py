from django.contrib import admin
from .models import Track, HistoryItem, Artist, Album

# Register your models here.
class TrackArtistInline(admin.TabularInline):
    model = Track.artists.through

class AlbumArtistInline(admin.TabularInline):
    model = Album.artists.through

class ArtistAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class AlbumAdmin(admin.ModelAdmin):
    list_display = ('title', 'get_artists',)
    inlines = (AlbumArtistInline,)
    search_fields = ('title', 'artist',)

    def get_artists(self, obj):
        return ', '.join([artist.name for artist in obj.artists.all()])
    get_artists.short_description = 'Artists'
    
class TrackAdmin(admin.ModelAdmin):
    list_display = ('title', 'get_artists', 'album',)
    inlines = (TrackArtistInline,)
    search_fields = ('title', 'artist', 'album',)

    def get_artists(self, obj):
        return ', '.join([artist.name for artist in obj.artists.all()])
    get_artists.short_description = 'Artists'

class HistoryItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'track', 'played_at',)
    search_fields = ('user__email', 'track__title', 'track__artists', 'track__album',)

admin.site.register(Artist, ArtistAdmin)
admin.site.register(Album, AlbumAdmin)
admin.site.register(Track, TrackAdmin)
admin.site.register(HistoryItem, HistoryItemAdmin)