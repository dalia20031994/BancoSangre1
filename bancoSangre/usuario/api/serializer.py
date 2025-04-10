from rest_framework import serializers
from usuario.models import Usuario
import re

class UsuarioSerializer(serializers.ModelSerializer):
    
    # Validación personalizada para el nombre de usuario
    def validate_nombre_usuario(self, value):
        if not re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', value):
            raise serializers.ValidationError("El nombre solo puede contener letras y espacios.")
        return value
    # Validación personalizada para el correo
    def validate_correo(self, value):
        if not re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+$', value):
            raise serializers.ValidationError("Ingrese un correo válido.")
        return value
    # Validación personalizada para la contraseña
    def validate_contraseña(self, value):
        if not re.match(r'^[a-zA-Z0-9@#$%^&+=!?*-]{8,20}$', value):
            raise serializers.ValidationError(
                "La contraseña debe tener entre 8 y 20 caracteres, incluyendo letras, números y símbolos."
            )
        return value
    class Meta:
        model = Usuario  
        fields = '__all__'  
