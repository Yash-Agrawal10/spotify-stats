from django.urls import path
from .views import UpdateHistoryView, GetHistoryView

urlpatterns = [
    path('update/', UpdateHistoryView.as_view()),
    path('get/', GetHistoryView.as_view()),
]