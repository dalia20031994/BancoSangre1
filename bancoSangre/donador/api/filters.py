import django_filters
from donador.models import Donador

class DonadorFilter(django_filters.FilterSet):
    class Meta:
        model = Donador
        fields = {
            'estado': ['exact'],
            'tipoSangre': ['exact'],
            'edad': ['exact', 'gte', 'lte'],
            'usuario__sexo': ['exact'],
        }
