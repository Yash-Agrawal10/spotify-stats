from django.urls import path
from .views import SpotifyAuthView, SpotifyCallbackView

urlpatterns = [
    path('auth/', SpotifyAuthView.as_view(), name='spotify_auth'),
    path('callback/', SpotifyCallbackView.as_view(), name='spotify_callback'),
]