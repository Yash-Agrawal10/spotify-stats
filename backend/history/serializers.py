from .models import Track, HistoryItem, Artist, Album
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField

class ArtistSerializer(ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'

class AlbumSerializer(ModelSerializer):
    artists = PrimaryKeyRelatedField(queryset=Artist.objects.all(), many=True)

    class Meta:
        model = Album
        fields = '__all__'

class TrackSerializer(ModelSerializer):
    album = PrimaryKeyRelatedField(queryset=Album.objects.all())
    artists = PrimaryKeyRelatedField(queryset=Artist.objects.all(), many=True)

    class Meta:
        model = Track
        fields = '__all__'

class HistoryItemSerializer(ModelSerializer):
    track = PrimaryKeyRelatedField(queryset=Track.objects.all())

    class Meta:
        model = HistoryItem
        fields = '__all__'