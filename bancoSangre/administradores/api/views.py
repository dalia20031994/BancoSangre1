from rest_framework import viewsets
from administradores.models import Administrador
from administradores.api.serializer import AdministradoresSerializer

class AdministradoresViewSet(viewsets.ModelViewSet):
    queryset = Administrador.objects.all()
    serializer_class = AdministradoresSerializer

