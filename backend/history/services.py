from .models import Track, HistoryItem, Artist, Album
from .serializers import ArtistSerializer, AlbumSerializer, TrackSerializer, HistoryItemSerializer
from spotify.services import get_recently_played

from django.db.models import Count, F, Value, CharField
from django.db.models.functions import Concat

from users.models import UserAccount

# Update history
def convert_spotify_release_date(release_date: str, precision: str) -> str:
    if precision == 'year':
        # Default to January 1st of the given year
        return f"{release_date}-01-01"
    elif precision == 'month':
        # Default to the first day of the given month
        return f"{release_date}-01"
    elif precision == 'day':
        # The date is already in the correct format
        return release_date
    else:
        raise ValueError(f"Unknown precision: {precision}")


def process_artist(artist_data):
    filtered_data = {
        'spotify_id': artist_data['id'],
        'name': artist_data['name'],
    }
    try:
        artist = Artist.objects.get(spotify_id=artist_data['id'])
        artist_serializer = ArtistSerializer(artist, data=filtered_data)
    except:
        artist_serializer = ArtistSerializer(data=filtered_data)
    if artist_serializer.is_valid():
        artist = artist_serializer.save()
        return artist
    else:
        raise Exception(artist_serializer.errors)
    
def process_album(album_data):
    artist_pks = [process_artist(artist).pk for artist in album_data['artists']]
    date = convert_spotify_release_date(album_data['release_date'], album_data['release_date_precision'])
    filtered_data = {
        'spotify_id': album_data['id'],
        'name': album_data['name'],
        'artists': artist_pks,
        'release_date': date,
        'release_date_precision': album_data['release_date_precision'],
    }
    try:
        album = Album.objects.get(spotify_id=album_data['id'])
        album_serializer = AlbumSerializer(album, data=filtered_data)
    except:
        album_serializer = AlbumSerializer(data=filtered_data)
    if album_serializer.is_valid():
        album = album_serializer.save()
        return album
    else:
        raise Exception(album_serializer.errors)

def process_track(track_data):
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
    try:
        track = Track.objects.get(spotify_id=track_data['id'])
        track_serializer = TrackSerializer(track, data=filtered_data)
    except:
        track_serializer = TrackSerializer(data=filtered_data)
    if track_serializer.is_valid():
        track = track_serializer.save()
        return track
    else:
        raise Exception(track_serializer.errors)

def process_history_item(user:UserAccount, history_item_data):
    track_pk = process_track(history_item_data['track']).pk
    filtered_data = {
        'user': user.pk,
        'track': track_pk,
        'played_at': history_item_data['played_at'],
    }
    try:
        history_item = HistoryItem.objects.get(user=user, track=track_pk, played_at=history_item_data['played_at'])
        history_item_serializer = HistoryItemSerializer(history_item, data=filtered_data)
    except:
        history_item_serializer = HistoryItemSerializer(data=filtered_data)
    if history_item_serializer.is_valid():
        history_item = history_item_serializer.save()
        return history_item
    else:
        raise Exception(history_item_serializer.errors)

def update_history(user:UserAccount):
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

def get_history(user:UserAccount, limit:int=25):
    history = HistoryItem.objects.filter(user=user)[:limit]
    readable_history = [get_readable_history_item(item) for item in history]
    return readable_history

def get_top_artists(user:UserAccount, limit:int=10):
    top = (
        HistoryItem.objects.filter(user=user)
        .values('track__artists')
        .annotate(name=F('track__artists__name'))
        .annotate(streams=Count('track__artists'))
        .order_by('-streams')[:limit]
        .values('name', 'streams')
    )

    return list(top)

def get_top_tracks(user:UserAccount, limit:int=10):
    top = (
        HistoryItem.objects.filter(user=user)
        .values('track')
        .annotate(name=F('track__title'))
        .annotate(artists=F('track__artists__name'))
        .annotate(streams=Count('track'))
        .order_by('-streams')[:limit]
        .values('name', 'streams')
    )

    return list(top)

def get_top_albums(user:UserAccount, limit:int=10):
    top = (
        HistoryItem.objects.filter(user=user)
        .values('track__album')
        .annotate(name=F('track__album__name'))
        .annotate(artists=Concat('track__album__artists__name', Value(' '), output_field=CharField()))
        .annotate(streams=Count('track__album'))
        .order_by('-streams')[:limit]
        .values('name', 'streams')
    )

    return list(top)