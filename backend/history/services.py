from .models import Song, History, Artist
from spotify.services import get_recently_played

# Update history
def process_song(song_data):
    song = Song.objects.filter(spotify_id=song_data['id']).first()
    if song:
        return song
    new_song = Song.objects.create(
        spotify_id=song_data['id'],
        title=song_data['name'],
        album=song_data['album']['name'],
        duration_ms=song_data['duration_ms'],
    )
    for artist_data in song_data['artists']:
        artist = Artist.objects.filter(spotify_id=artist_data['id']).first()
        if not artist:
            artist = Artist.objects.create(
                spotify_id=artist_data['id'],
                name=artist_data['name'],
            )
        new_song.artists.add(artist)
    new_song.save()
    return new_song

def update_history(user):
    recently_played = get_recently_played(user)
    if not recently_played:
        return None
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

# Get history
def get_history(user):
    history = user.history_set.all().order_by('-played_at')
    response = []
    for item in history:
        response.append({
            'song': {
                'id': item.song.spotify_id,
                'title': item.song.title,
                'album': item.song.album,
                'artists': [artist.name for artist in item.song.artists.all()],
                'duration_ms': item.song.duration_ms,
            },
            'played_at': item.played_at,
        })
    return response