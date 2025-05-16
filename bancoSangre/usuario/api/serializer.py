from rest_framework import serializers
from usuario.models import Usuario
import re
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
    def validate_password(self, value):
        if len(value) < 8 or len(value) > 15:
            raise serializers.ValidationError(
            "La contraseña debe tener entre 8 y 15 caracteres."
        )
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError(
            "La contraseña debe contener al menos una letra mayúscula."
        )
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError(
            "La contraseña debe contener al menos una letra mayúscula."
        )
        if not re.search(r'\d', value):
            raise serializers.ValidationError(
            "La contraseña debe contener al menos un número."
        )
        if not re.search(r'[@#$%^&+=!?*-]', value):
            raise serializers.ValidationError(
            "La contraseña debe contener al menos un símbolo especial (@#$%^&+=!?*-)."
        )
        if not re.match(r'^[a-zA-Z0-9@#$%^&+=!?*-]+$', value):
            raise serializers.ValidationError(
            "La contraseña contiene caracteres no permitidos."
        )
        return value

    class Meta:
        model = Usuario  
        fields = '__all__'  
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = Usuario.objects.create(**validated_data)
        if password:
            user.set_password(password)  # Encripta la contraseña antes de guardarla
        user.save()
        return user
