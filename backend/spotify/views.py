from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.conf import settings
from urllib.parse import urlencode
from rest_framework.views import APIView
from .services import get_spotify_auth_url, exchange_code_for_token
from rest_framework.permissions import IsAuthenticated
import secrets
from .models import OAuthState

# Create your views here.
class SpotifyAuthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        state = secrets.token_urlsafe()
        old_states = OAuthState.objects.filter(user=user)
        old_states.delete()
        OAuthState.objects.create(user=user, state=state)
        scopes = 'user-read-recently-played'
        auth_url = get_spotify_auth_url(scopes, state)
        return HttpResponseRedirect(auth_url)
    
class SpotifyCallbackView(APIView):
    
    def get(self, request, format=None):
        # Get information from request
        state = request.GET.get('state')
        code = request.GET.get('code')
        error = request.GET.get('error')
        redirect_url = settings.FRONTEND_URL

        # Return error if there is one
        if error:
            return JsonResponse({'error': error}, status=400)
        
        if code:
            # Get user and check if state is valid
            try:
                oauth_state = OAuthState.objects.get(state=state)
                user = oauth_state.user
                oauth_state.delete()
            except OAuthState.DoesNotExist:
                return JsonResponse({'error': 'Invalid state'}, status=400)
            
            # Exchange code for token
            success, response = exchange_code_for_token(user, code)
            if success:
                params = {'success': 'true', 'details': 'Authorization successful'}
            else:
                params = {'success': 'false', 'details': response}
        else:
            params = {'success': 'false', 'details': 'No code provided'}
        
        redirect_url_with_params = f'{redirect_url}?{urlencode(params)}'
        return HttpResponseRedirect(redirect_url_with_params)
