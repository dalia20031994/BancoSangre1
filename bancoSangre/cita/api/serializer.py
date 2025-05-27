from rest_framework import serializers
from cita.models import Cita

class CitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cita
        fields = '__all__'  # o lista de campos que quieras exponer
