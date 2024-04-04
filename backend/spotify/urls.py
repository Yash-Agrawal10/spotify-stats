from django.urls import path
from .views import spotify_auth, spotify_callback

urlpatterns = [
    path('auth/', spotify_auth.as_view(), name='spotify_auth'),
    path('callback/', spotify_callback.as_view(), name='spotify_callback'),
]