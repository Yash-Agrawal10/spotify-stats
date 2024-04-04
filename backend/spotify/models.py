from django.db import models

# Create your models here.
class SpotifyToken(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    access_token = models.CharField(max_length=150)
    token_type = models.CharField(max_length=150)
    scope = models.TextField()
    expires_in = models.DateTimeField()
    refresh_token = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now=True)