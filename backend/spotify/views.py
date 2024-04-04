from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from rest_framework.views import APIView
from .services import get_spotify_auth_url, exchange_code_for_token
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class spotify_login(APIView):
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

        if error:
            return JsonResponse({'error': error}, status=400)
        
        if code:
            success, response = exchange_code_for_token(user, code)
            if success:
                return JsonResponse({'details': 'Spotify token has been updated'}, status=200)
            return JsonResponse({'error': 'Invalid request'}, status=400)