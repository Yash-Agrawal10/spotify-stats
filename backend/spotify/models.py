from django.db import models
from django.conf import settings
from datetime import timedelta
from django.utils import timezone

# Create your models here.
class SpotifyToken(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    access_token = models.CharField(max_length=250)
    token_type = models.CharField(max_length=250)
    scope = models.TextField()
    expires_in = models.DateTimeField()
    refresh_token = models.CharField(max_length=250)

    def __str__(self):
        return f"{self.user.email}'s Spotify Token"
    
class OAuthState(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    state = models.CharField(max_length=250, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def is_state_valid(user, state):
        expiration_time = timezone.now() - timedelta(minutes=5)
        return OAuthState.objects.filter(user=user, state=state, created_at__gte=expiration_time).exists()