from .models import Track, History, Artist, Album
from .serializers import ArtistSerializer, AlbumSerializer, TrackSerializer, HistorySerializer
from spotify.services import get_recently_played

# Update history
def process_artist(artist_data):
    artist = Artist.objects.filter(spotify_id=artist_data['id']).first()
    if artist:
        return artist
    filtered_data = {
        'spotify_id': artist_data['id'],
        'name': artist_data['name'],
    }
    artist_serializer = ArtistSerializer(data=filtered_data)
    if artist_serializer.is_valid():
        artist = artist_serializer.save()
        return artist
    raise Exception(artist_serializer.errors)
    
def process_album(album_data):
    album = Album.objects.filter(spotify_id=album_data['id']).first()
    if album:
        return album
    artist_pks = [process_artist(artist).pk for artist in album_data['artists']]
    filtered_data = {
        'spotify_id': album_data['id'],
        'name': album_data['name'],
        'artists': artist_pks,
        'release_date': album_data['release_date'],
    }
    album_serializer = AlbumSerializer(data=filtered_data)
    if album_serializer.is_valid():
        album = album_serializer.save()
        return album
    raise Exception(album_serializer.errors)

def process_track(track_data):
    track = Track.objects.filter(spotify_id=track_data['id']).first()
    if track:
        return track
    album_pk = process_album(track_data['album']).pk
    artist_pks = [process_artist(artist).pk for artist in track_data['artists']]
    filtered_data = {
        'spotify_id': track_data['id'],
        'title': track_data['name'],
        'artists': artist_pks,
        'album': album_pk,
        'duration_ms': track_data['duration_ms'],
        'preview_url': track_data['preview_url'],
        'track_number': track_data['track_number'],
    }
    track_serializer = TrackSerializer(data=filtered_data)
    if track_serializer.is_valid():
        track = track_serializer.save()
        return track
    raise Exception(track_serializer.errors)

def process_history(user, history_data):
    track_pk = process_track(history_data['track']).pk
    filtered_data = {
        'user': user.pk,
        'track': track_pk,
        'played_at': history_data['played_at'],
    }
    history_serializer = HistorySerializer(data=filtered_data)
    if history_serializer.is_valid():
        history = history_serializer.save()
        return history
    raise Exception(history_serializer.errors)

def update_history(user):
    history_data = get_recently_played(user)
    for item in history_data:
        process_history(user, item)
    return True

# Get history
def history_to_dict(history):
    history_dict = {
        'track': history.track.title,
        'album': history.track.album,
        'artists': [artist.name for artist in history.track.artists.all()],
        'played_at': history.played_at,
    }     
    return history_dict

def get_history(user):
    history = History.objects.filter(user=user)
    response = []
    for item in history:
        response.append(history_to_dict(item))
    return response