from rest_framework import serializers
from .models import HedgingSpr

class HedgingSprSerializer(serializers.ModelSerializer):
    class Meta:
        model = HedgingSpr
        fields = '__all__'