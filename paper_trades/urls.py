from django.urls import path
from .views import HedgingAPIView, HedgingListAPIView

urlpatterns = [
    path('', HedgingListAPIView.as_view(), name='hedging-list'),
    path('create/', HedgingAPIView.as_view(), name='hedging-create'),
]

