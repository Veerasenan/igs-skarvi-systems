from django.urls import path
from . import views
from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt.views import TokenRefreshView




urlpatterns = [
    path('api/hedging/', views.HedgingAPIView.as_view(), name='hedging-create'),
    path('hedging/list/', views.HedgingListAPIView.as_view(), name='hedging-list'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    


]