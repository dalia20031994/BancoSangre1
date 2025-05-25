import re
from rest_framework import serializers
from donador.models import Donador
from usuario.models import Usuario  

#incluido por d
from direccion.models import Direccion
from coordenada.models import Coordenada
from colonia.models import Colonia

class DonadorSerializer(serializers.ModelSerializer):
    #solo se daran de lata los que tengan el rol 2: donador
    usuario = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.filter(rol__nombre="donador")
    )

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
        if value and not re.match(r'^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$', value):
            raise serializers.ValidationError("El apellido materno solo debe contener letras y espacios si se proporciona.")
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
class DonadorMapaSerializer(serializers.ModelSerializer):
    direccion = serializers.SerializerMethodField()
    sexo = serializers.CharField(source='usuario.sexo')

    class Meta:
        model = Donador
        fields = ['id', 'nombre', 'apellidoP','apellidoM', 'edad', 'tipoSangre', 
                 'peso', 'telefonoUno', 'primeraDonacion','ultimaDonacion', 'direccion', 'sexo']

    def get_direccion(self, obj):
        direccion = obj.direccion
        return {
            'calle': direccion.calle,
            'numExterior': direccion.numExterior,
            'numInterior': direccion.numInterior,
            'coordenadas': {
                'latitud': direccion.coordenadas.latitud,
                'longitud': direccion.coordenadas.longitud
            }
        }