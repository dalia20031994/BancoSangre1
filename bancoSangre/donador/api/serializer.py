import re
from rest_framework import serializers
from donador.models import Donador

class DonadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donador
        fields = '__all__'

    def validate_nombre(self, value):
        if not re.match(r'^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$', value):
            raise serializers.ValidationError("El nombre solo debe contener letras y espacios.")
        return value

    def validate_apellidoP(self, value):
        if not re.match(r'^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$', value):
            raise serializers.ValidationError("El apellido paterno solo debe contener letras y espacios.")
        return value

    def validate_apellidoM(self, value):
        if not re.match(r'^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$', value):
            raise serializers.ValidationError("El apellido materno solo debe contener letras y espacios.")
        return value

    def validate_tipoSangre(self, value):
        if not re.match(r'^(A|B|AB|O)[+-]$', value):
            raise serializers.ValidationError("El tipo de sangre debe ser A+, A-, B+, B-, AB+, AB-, O+ o O-.")
        return value

    def validate_telefonoUno(self, value):
        if not re.match(r'^\d{10}$', value):
            raise serializers.ValidationError("El teléfono debe contener exactamente 10 dígitos.")
        return value

    def validate_telefonoDos(self, value):
        if value and not re.match(r'^\d{10}$', value):
            raise serializers.ValidationError("El segundo teléfono debe contener exactamente 10 dígitos si se proporciona.")
        return value
