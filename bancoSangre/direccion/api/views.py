from rest_framework import viewsets
from direccion.models import Direccion
from direccion.api.serializer import DireccionSerializer

class DireccionViewSet(viewsets.ModelViewSet):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
