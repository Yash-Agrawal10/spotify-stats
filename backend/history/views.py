from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .services import update_history

# Create your views here.
class UpdateHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        response = update_history(user)
        if not response:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)