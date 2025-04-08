from rest_framework import viewsets
from coordenada.models import Coordenada
from coordenada.api.serializer import CoordenadaSerializer

class CoordenadaViewSet(viewsets.ModelViewSet):
    queryset = Coordenada.objects.all()
    serializer_class = CoordenadaSerializer

