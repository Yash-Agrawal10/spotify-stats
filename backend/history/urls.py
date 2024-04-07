from django.urls import path
from .views import UpdateHistoryView, GetHistoryView, GetTopView

urlpatterns = [
    path('update/', UpdateHistoryView.as_view()),
    path('history/', GetHistoryView.as_view()),
    path('top/', GetTopView.as_view()),
]