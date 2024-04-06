from rest_framework import serializers
from .models import History, Track, Album, Artist

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'

class AlbumSerializer(serializers.ModelSerializer):
    artists = ArtistSerializer(many=True, read_only=True)

    class Meta:
        model = Album
        fields = '__all__'

class TrackSerializer(serializers.ModelSerializer):
    artists = ArtistSerializer(many=True, read_only=True)
    album = AlbumSerializer(read_only=True)

    class Meta:
        model = Track
        fields = '__all__'

class HistorySerializer(serializers.ModelSerializer):
    track = TrackSerializer(read_only=True)

    class Meta:
        model = History
        fields = '__all__'