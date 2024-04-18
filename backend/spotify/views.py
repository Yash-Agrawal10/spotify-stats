from django.http import HttpResponseRedirect, JsonResponse
from django.conf import settings
from urllib.parse import urlencode
from rest_framework.views import APIView
from .services import get_spotify_auth_url, exchange_code_for_token, check_valid_and_refresh
from rest_framework.permissions import IsAuthenticated
import secrets
from .models import OAuthState, SpotifyToken
from .serializers import OAuthStateSerializer, SpotifyTokenSerializer

# Create your views here.
class SpotifyAuthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        # Check for existing token
        token = SpotifyToken.objects.filter(user=user).first()
        if token and not check_valid_and_refresh(token):
            token.delete()
            token = None
        if not token:
            OAuthState.objects.filter(user=user).delete()
            state = secrets.token_urlsafe()
            oauth_state_serializer = OAuthStateSerializer(data={'user': user.pk, 'state': state})
            if oauth_state_serializer.is_valid(raise_exception=True):
                oauth_state_serializer.save()
            auth_url = get_spotify_auth_url(state)
            return JsonResponse({'redirect_url': auth_url}, status=200)
        else:
            redirect_url = settings.FRONTEND_URL
            return JsonResponse({'redirect_url': redirect_url}, status=302)        
    
class SpotifyCallbackView(APIView):
    
    def get(self, request, format=None):
        # Get information from request
        state = request.GET.get('state')
        code = request.GET.get('code')
        error = request.GET.get('error')

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
                token_data = response
                token_serializer = SpotifyTokenSerializer(data=token_data)
                if token_serializer.is_valid(raise_exception=True):
                    token_serializer.save()
                    params = {'success': 'true', 'details': 'Token successfully created'}
                else:
                    params = {'success': 'false', 'details': 'Token creation failed'}
            else:
                params = {'success': 'false', 'details': response}
        else:
            params = {'success': 'false', 'details': 'No code provided'}

        redirect_url = settings.FRONTEND_URL
        redirect_url_with_params = f'{redirect_url}?{urlencode(params)}'
        return HttpResponseRedirect(redirect_url_with_params)
