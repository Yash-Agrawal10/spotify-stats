from rest_framework import serializers
from .models import History, Song, Album, Artist

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'

    def create(self, validated_data):
        artist, _ = Artist.objects.get_or_create(**validated_data)
        return artist

class AlbumSerializer(serializers.ModelSerializer):
    artists = ArtistSerializer(many=True)

    class Meta:
        model = Album
        fields = '__all__'

    def create(self, validated_data):
        artists_data = validated_data.pop('artists')
        album, _ = Album.objects.get_or_create(**validated_data)
        for artist_data in artists_data:
            artist_serializer = ArtistSerializer(data=artist_data)
            if artist_serializer.is_valid(raise_exception=True):
                artist = artist_serializer.save()
                album.artists.add(artist)
        return album

class SongSerializer(serializers.ModelSerializer):
    artists = ArtistSerializer(many=True)
    album = AlbumSerializer()

    class Meta:
        model = Song
        fields = '__all__'

    def create(self, validated_data):
        album_data = validated_data.pop('album')
        artists_data = validated_data.pop('artists')
        album_serializer = AlbumSerializer(data=album_data)
        if album_serializer.is_valid(raise_exception=True):
            album = album_serializer.save()
            song, _ = Song.objects.get_or_create(album=album, **validated_data)
            for artist_data in artists_data:
                artist_serializer = ArtistSerializer(data=artist_data)
                if artist_serializer.is_valid(raise_exception=True):
                    artist = artist_serializer.save()
                    song.artists.add(artist)
        return song

class HistorySerializer(serializers.ModelSerializer):
    song = SongSerializer()
    class Meta:
        model = History
        fields = '__all__'