from rest_framework import viewsets
from usuario.models import Usuario  # Importa la clase Usuario correctamente
from usuario.api.serializer import UsuarioSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()  # Usa Usuario con mayúscula
    serializer_class = UsuarioSerializer
