from rest_framework import viewsets
from usuario.models import Usuario  
from usuario.api.serializer import UsuarioSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()  
    serializer_class = UsuarioSerializer

