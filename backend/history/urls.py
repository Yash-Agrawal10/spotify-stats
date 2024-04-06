from django.urls import path
from .views import UpdateHistoryView

urlpatterns = [
    path('update/', UpdateHistoryView.as_view())
]