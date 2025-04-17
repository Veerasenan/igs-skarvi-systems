from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Login

from rest_framework.permissions import AllowAny

class LoginAPIView(APIView):
    permission_classes = [AllowAny]  # <-- Add this line ✅
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and Password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = Login.objects.get(username=username, password=password)
            request.session['username'] = user.username  
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        except Login.DoesNotExist:
            return Response({'error': 'Invalid Username or Password'}, status=status.HTTP_401_UNAUTHORIZED)
