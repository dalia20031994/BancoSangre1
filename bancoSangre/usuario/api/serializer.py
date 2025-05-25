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
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        # 'rol' es un ForeignKey, así que no lo sacamos con pop.
        # PERO, si estás enviando 'groups' o 'user_permissions', sí debes sacarlos:
        groups_data = validated_data.pop('groups', None) # Extraer datos de grupos
        user_permissions_data = validated_data.pop('user_permissions', None) # Extraer datos de permisos de usuario

        # Actualiza los campos simples (incluido 'rol' ya que es ForeignKey)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Maneja la contraseña por separado
        if password:
            instance.set_password(password)

        instance.save() # Guarda la instancia principal ANTES de actualizar relaciones M2M

        # Maneja las relaciones ManyToMany DESPUÉS de que el usuario ha sido guardado
        if groups_data is not None:
            instance.groups.set(groups_data)
        if user_permissions_data is not None:
            instance.user_permissions.set(user_permissions_data)

        return instance