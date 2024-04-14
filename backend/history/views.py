from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .services import update_history, get_readable_history, get_top_artists, get_top_tracks, get_top_albums

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
        type = request.GET.get('type')
        limit = int(request.GET.get('limit'))
        start_date = request.GET.get('start')
        end_date = request.GET.get('end')
        if type == 'artists':
            data = get_top_artists(user, limit, start_date, end_date)
        elif type == 'tracks':
            data = get_top_tracks(user, limit, start_date, end_date)
        elif type == 'albums':
            data = get_top_albums(user, limit, start_date, end_date)
        elif type == 'history':
            data = get_readable_history(user, limit, start_date, end_date)
        else:
            data = {"detail": "Invalid type"}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        return Response(data, status=status.HTTP_200_OK)