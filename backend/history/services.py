from .models import Song, History, Artist, Album
from spotify.services import get_recently_played
import pandas as pd, numpy as np

# Process / Update history
def process_song(song_data):
    song = Song.objects.filter(spotify_id=song_data['id']).first()
    if song:
        return song
    new_song = Song.objects.create(
        spotify_id=song_data['id'],
        title=song_data['name'],
        duration_ms=song_data['duration_ms'],
    )
    album = process_album(song_data['album'])
    new_song.album = album
    for artist_data in song_data['artists']:
        artist = process_artist(artist_data)
        new_song.artists.add(artist)
    new_song.save()
    return new_song

def process_artist(artist_data):
    artist = Artist.objects.filter(spotify_id=artist_data['id']).first()
    if not artist:
        artist = Artist.objects.create(
            spotify_id=artist_data['id'],
            name=artist_data['name'],
        )
    return artist

def process_album(album_data):
    album = Album.objects.filter(spotify_id=album_data['id']).first()
    if not album:
        album = Album.objects.create(
            spotify_id=album_data['id'],
            name=album_data['name'],
            release_date=album_data['release_date'],
        )
        for artist_data in album_data['artists']:
            artist = process_artist(artist_data)
            album.artists.add(artist)
        album.save()
    return album

def update_history(user):
    recently_played = get_recently_played(user)
    if not recently_played:
        return False
    for item in recently_played:
        song = process_song(item['track'])
        played_at = item['played_at']
        old_history = History.objects.filter(user=user, song=song, played_at=played_at).first()
        if old_history:
            continue
        history = History.objects.create(
            user=user,
            song=song,
            played_at=played_at,
        )
        history.save()
    return True

# Get history
def history_to_dict(history):
    history_dict = {
        'song': history.song.title,
        'album': history.song.album,
        'artists': [artist.name for artist in history.song.artists.all()],
        'played_at': history.played_at,
    }     
    return history_dict

def get_history(user):
    history = History.objects.filter(user=user)
    response = []
    for item in history:
        response.append(history_to_dict(item))
    return response