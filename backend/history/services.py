from .models import Song, History, Artist, Album
from spotify.services import get_recently_played
from .serializers import HistorySerializer, SongSerializer, AlbumSerializer, ArtistSerializer

# Update history
def update_history(user):
    history = get_recently_played(user)
    for item in history:
        song_data = item['track']
        song_serializer = SongSerializer(data=song_data)
        if song_serializer.is_valid(raise_exception=True):
            song = song_serializer.save()
            history_data = {
                'user': user,
                'song': song,
                'played_at': item['played_at'],
            }
            history_serializer = HistorySerializer(data=history_data)
            if history_serializer.is_valid(raise_exception=True):
                history_serializer.save()
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