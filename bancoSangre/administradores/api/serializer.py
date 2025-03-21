from rest_framework import serializers
from administradores.models import Administrador  # Corregido a mayúscula inicial

class AdministradoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrador  # Corregido a mayúscula inicial
        fields = '__all__'
