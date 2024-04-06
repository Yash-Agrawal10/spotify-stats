# serializers.py
from rest_framework import serializers
from .models import SpotifyToken, OAuthState

class SpotifyTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpotifyToken
        fields = '__all__'

class OAuthStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OAuthState
        fields = '__all__'