from django.db import models
from django.conf import settings

# Create your models here.
class Artist(models.Model):
    spotify_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255, unique=True)

    # genres
    # popularity
    # followers

    def __str__(self):
        return self.name
    
class Album(models.Model):
    spotify_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    artists = models.ManyToManyField(Artist, related_name='albums')
    release_date = models.DateField()

    def __str__(self):
        artists = ', '.join([artist.name for artist in self.artists.all()])
        return f"{self.name} by {artists}"

class Song(models.Model):
    spotify_id = models.CharField(max_length=255, unique=True)
    title = models.CharField(max_length=255)
    artists = models.ManyToManyField(Artist, related_name='songs')
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='songs')
    duration_ms = models.IntegerField() # milliseconds
    preview_url = models.URLField(null=True)
    track_number = models.IntegerField()
    # popularity

    def __str__(self):
        artists = ', '.join([artist.name for artist in self.artists.all()])
        return f"{self.title} by {artists}"
    
class History(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='history')
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name='instances')
    played_at = models.DateTimeField()

    class Meta:
        ordering = ['-played_at']

    def __str__(self):
        return f"{self.user.email} listened to {self.song} by {self.user} at {self.played_at.strftime('%Y-%m-%d %H:%M:%S')}"