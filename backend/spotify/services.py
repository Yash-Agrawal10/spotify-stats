import requests
from django.utils import timezone
from datetime import timedelta
from .models import SpotifyToken

# Get environment variables
import os
client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')
redirect_uri = os.getenv('REDIRECT_URI')

# Token services
def get_spotify_auth_url(scopes:str, state:str=None):
    params = {
        'client_id': client_id,
        'response_type': 'code',
        'redirect_uri': redirect_uri,
        'scope': scopes,
        'state': state,
    }
    endpoint = 'https://accounts.spotify.com/authorize'
    url = requests.Request('GET', endpoint, params=params).prepare().url
    return url

def exchange_code_for_token(user, code:str):
    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,
        'client_id': client_id,
        'client_secret': client_secret,
    }
    endpoint = 'https://accounts.spotify.com/api/token'
    response = requests.post(endpoint, data=data)
    if response.status_code in range(200, 299):
        token_data = response.json()
        token_data['user'] = user.pk
        token_data['expires_in'] = timezone.now() + timedelta(seconds=token_data['expires_in'])
        return True, token_data
    return False, response.json()

def get_spotify_access_token(user):
    try:
        spotify_token = SpotifyToken.objects.get(user=user)
        if spotify_token.expires_in <= timezone.now():
            new_access_token = refresh_spotify_token(spotify_token)
            return new_access_token
        else:
            return spotify_token.access_token
    except SpotifyToken.DoesNotExist:
        return None
    
def refresh_spotify_token(spotify_token:SpotifyToken):
    endpoint = 'https://accounts.spotify.com/api/token'
    data = {
        'grant_type': 'refresh_token',
        'refresh_token': spotify_token.refresh_token,
        'client_id': client_id,
        'client_secret': client_secret,
    }
    response = requests.post(endpoint, data=data)
    if response.status_code in range(200, 299):
        response_json = response.json()
        spotify_token.access_token = response_json['access_token']
        expires_in = timezone.now() + timedelta(seconds=response_json['expires_in'])
        spotify_token.expires_in = expires_in
        spotify_token.save(update_fields=['access_token', 'expires_in'])
        return spotify_token.access_token
    else:
        return None
    
def check_valid_and_refresh(token:SpotifyToken):
    refreshed_access_token = refresh_spotify_token(token)
    if refreshed_access_token:
        return True
    return False

# API services
def make_spotify_api_request(user, endpoint:str, type:str='GET', data:dict=None):
    access_token = get_spotify_access_token(user)
    if access_token:
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        response = requests.get(endpoint, headers=headers)
        return response
    else:
        return None
    
def get_recently_played(user, limit:int=50):
    endpoint = 'https://api.spotify.com/v1/me/player/recently-played'
    params = {
        'limit': limit,
    }
    response = make_spotify_api_request(user, endpoint)
    if response and response.status_code in range(200, 299):
        return response.json()["items"]
    return None