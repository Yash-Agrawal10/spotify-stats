from django.contrib import admin
from .models import Song, History

# Register your models here.
class SongAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'album',)
    search_fields = ('title', 'artist', 'album',)

class HistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'song', 'listened_at',)
    search_fields = ('user__email', 'song__title', 'song__artist', 'song__album',)

admin.site.register(Song, SongAdmin)
admin.site.register(History, HistoryAdmin)