from .models import Track, History, Artist, Album
from spotify.services import get_recently_played

# Update history
def update_history(user):
    history_data = get_recently_played(user)
    history = []
    for item in history_data:
        history.append(process_history(item, user))
    return history

def process_history(history_data, user) -> bool:
    track_data = history_data['track']
    track = process_track(track_data)
    played_at = history_data['played_at']
    history, created = History.objects.get_or_create(user=user, track=track, played_at=played_at)
    return history

def process_track(track_data):
    filtered_data = {
        'spotify_id': track_data['id'],
        'title': track_data['name'],
        'duration_ms': track_data['duration_ms'],
        'preview_url': track_data['preview_url'],
        'track_number': track_data['track_number'],
    }
    track, created = Track.objects.get_or_create(spotify_id=filtered_data['spotify_id'], defaults=filtered_data)
    if created:
        album = process_album(track_data['album'])
        track.album = album
        for artist_data in track_data['artists']:
            artist = process_artist(artist_data)
            track.artists.add(artist)
        track.save()
    return track

def process_album(album_data):
    filtered_data = {
        'spotify_id': album_data['id'],
        'name': album_data['name'],
        'release_date': album_data['release_date'],
    }
    album, created = Album.objects.get_or_create(spotify_id=filtered_data['spotify_id'], defaults=filtered_data)
    if created:
        for artist_data in album_data['artists']:
            artist = process_artist(artist_data)
            album.artists.add(artist)
        album.save()
    return album

def process_artist(artist_data):
    filtered_data = {
        'spotify_id': artist_data['id'],
        'name': artist_data['name'],
    }
    artist, created = Artist.objects.get_or_create(spotify_id=filtered_data['spotify_id'], defaults=filtered_data)
    return artist

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