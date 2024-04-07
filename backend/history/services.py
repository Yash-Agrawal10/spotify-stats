from .models import Track, HistoryItem, Artist, Album
from .serializers import ArtistSerializer, AlbumSerializer, TrackSerializer, HistoryItemSerializer
from spotify.services import get_recently_played
from django.db.models import Count, F, Value, CharField
from django.db.models.functions import Concat

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

def process_history_item(user, history_item_data):
    track_pk = process_track(history_item_data['track']).pk
    filtered_data = {
        'user': user.pk,
        'track': track_pk,
        'played_at': history_item_data['played_at'],
    }
    history_item = HistoryItem.objects.filter(user=user, track=track_pk, played_at=history_item_data['played_at']).first()
    if history_item:
        return history_item
    history_item_serializer = HistoryItemSerializer(data=filtered_data)
    if history_item_serializer.is_valid():
        history_item = history_item_serializer.save()
        return history_item
    raise Exception(history_item_serializer.errors)

def update_history(user):
    history_data = get_recently_played(user)
    for item in history_data:
        process_history_item(user, item)
    return True

# Analyze history
def get_readable_history_item(history_item):
    data = {
        'track': history_item.track.title,
        'artists': [artist.name for artist in history_item.track.artists.all()],
        'album': history_item.track.album.name,
        'played_at': history_item.played_at,
    }
    return data

def get_history(user):
    history = HistoryItem.objects.filter(user=user)
    readable_history = [get_readable_history_item(item) for item in history]
    return readable_history

def get_top(user, type:str, limit:int=10):
    if type == 'tracks':
        group_value = 'track'
        name = Concat(F('track__title'), Value(' by '), F('track__artists__name'), output_field=CharField())
    elif type == 'albums':
        group_value = 'track__album'
        name = Concat(F('track__album__name'), Value(' by '), F('track__album__artists__name'), output_field=CharField())
    elif type == 'artists':
        group_value = 'track__artists'
        name = F('track__artists__name')
    else:
        raise Exception('Invalid type')

    top = (
        HistoryItem.objects.filter(user=user)
        .values(group_value)
        .annotate(name=name)
        .annotate(streams=Count(group_value))
        .order_by('-streams')[:limit]
        .values('name', 'streams')
    )

    return list(top)