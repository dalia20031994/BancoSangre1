from rest_framework import serializers
from coordenada.models import Coordenada

class CoordenadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coordenada
        fields = '__all__'
