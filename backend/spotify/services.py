import requests
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .models import SpotifyToken

# Get environment variables
from dotenv import load_dotenv
import os
load_dotenv()
client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')
redirect_uri = os.getenv('REDIRECT_URI')

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
        expires_in = timezone.now() + timedelta(seconds=token_data['expires_in'])
        defaults = {
            'access_token': token_data['access_token'],
            'token_type': token_data['token_type'],
            'scope': token_data['scope'],
            'expires_in': expires_in,
            'refresh_token': token_data['refresh_token'],
        }
        SpotifyToken.objects.update_or_create(user=user, defaults=defaults)
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
    
def make_spotify_api_request(user, endpoint:str):
    access_token = get_spotify_access_token(user)
    if access_token:
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        response = requests.get(endpoint, headers=headers)
        return response
    else:
        return None
    
def check_valid_and_refresh(token:SpotifyToken):
    refreshed_access_token = refresh_spotify_token(token)
    if refreshed_access_token:
        return True
    return False