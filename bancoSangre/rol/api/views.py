# rol/api/views.py
from rest_framework import viewsets
from rol.models import Rol
from rol.api.serializer import RolSerializer

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
