from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.conf import settings
from urllib.parse import urlencode
from rest_framework.views import APIView
from .services import get_spotify_auth_url, exchange_code_for_token
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class spotify_auth(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        scopes = 'user-read-recently-played'
        auth_url = get_spotify_auth_url(scopes)
        return HttpResponseRedirect(auth_url)
    
class spotify_callback(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        code = request.GET.get('code')
        error = request.GET.get('error')
        user = request.user
        redirect_url = settings.FRONTEND_URL

        if error:
            return JsonResponse({'error': error}, status=400)
        
        if code:
            success, response = exchange_code_for_token(user, code)
            if success:
                params = {'success': 'true', 'details': 'Authorization successful'}
            else:
                params = {'success': 'false', 'details': response}
        else:
            params = {'success': 'false', 'details': 'No code provided'}
        
        redirect_url_with_params = f'{redirect_url}?{urlencode(params)}'
        return HttpResponseRedirect(redirect_url_with_params)
