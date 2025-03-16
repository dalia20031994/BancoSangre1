from rest_framework import serializers
from donadores.models import donadores

class donadoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = donadores
        fields = '__all__'
