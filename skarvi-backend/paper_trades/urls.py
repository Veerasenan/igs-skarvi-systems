from django.urls import path
from .views import HedgingAPIView, HedgingListAPIView

urlpatterns = [
    path('hedging/', HedgingAPIView.as_view(), name='hedging-create'),
    path('hedging/list/', HedgingListAPIView.as_view(), name='hedging-list'),
]