from django.contrib import admin
from .models import Song, History, Artist

# Register your models here.
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class SongArtistInline(admin.TabularInline):
    model = Song.artists.through
    
class SongAdmin(admin.ModelAdmin):
    list_display = ('title', 'get_artists', 'album',)
    inlines = (SongArtistInline,)
    search_fields = ('title', 'artist', 'album',)

    def get_artists(self, obj):
        return ', '.join([artist.name for artist in obj.artists.all()])
    get_artists.short_description = 'Artists'

class HistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'song', 'played_at',)
    search_fields = ('user__email', 'song__title', 'song__artists', 'song__album',)

admin.site.register(Artist, ArtistAdmin)
admin.site.register(Song, SongAdmin)
admin.site.register(History, HistoryAdmin)