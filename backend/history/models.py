from django.db import models
from django.conf import settings

# Create your models here.
class Song(models.Model):
    spotify_id = models.CharField(max_length=255, unique=True)
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    album = models.CharField(max_length=255)
    duration_ms = models.IntegerField() # milliseconds

    def __str__(self):
        return f"{self.title} by {self.artist}"
    
class History(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='history')
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name='instances')
    listened_at = models.DateTimeField()

    class Meta:
        ordering = ['-listened_at']

    def __str__(self):
        return f"{self.user.email} listened to {self.song} by {self.user} at {self.listened_at.strftime('%Y-%m-%d %H:%M:%S')}"