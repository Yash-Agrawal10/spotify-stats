from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .services import update_history, get_history, get_top_artists, get_top_tracks, get_top_albums

# Create your views here.
class UpdateHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        updated = update_history(user)
        if not updated:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)

class GetHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        limit = int(request.GET.get('limit'))
        history = get_history(user, limit)
        data = {
            'history': history,
        }
        return Response(data, status=status.HTTP_200_OK)
    
class GetTopView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        limit = int(request.GET.get('limit'))
        top_artists = get_top_artists(user, 'artists', limit)
        top_tracks = get_top_tracks(user, 'tracks', limit)
        top_albums = get_top_albums(user, 'albums', limit)
        data = {
            'artists': top_artists,
            'tracks': top_tracks,
            'albums': top_albums,
        }
        return Response(data, status=status.HTTP_200_OK)