from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .services import update_history, get_history

# Create your views here.
class GetHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        history = get_history(user)
        return Response(history, status=status.HTTP_200_OK)

class UpdateHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        updated = update_history(user)
        if not updated:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)