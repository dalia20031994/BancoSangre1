from rest_framework import viewsets, generics # <--- ¡Aquí está la clave!
from rest_framework import viewsets
from donador.models import Donador
from donador.api.serializer import DonadorSerializer
from .serializer import DonadorSerializer, DonadorMapaSerializer
from usuario.api.permissions import IsDonadorCreateReadOnly  # Asegúrate de importar el permiso
from rest_framework.response import Response
#agregado por dalia
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status
from datetime import date, timedelta
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from donador.api.filters import DonadorFilter


class DonadorViewSet(viewsets.ModelViewSet):
    queryset = Donador.objects.all()  # Todos los donadores
    serializer_class = DonadorSerializer  # El serializador de los donadores
    permission_classes = [IsDonadorCreateReadOnly]  # Asigna el permiso aquí para controlar el acceso
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = DonadorFilter
    filterset_fields = ['estado', 'tipoSangre', 'edad', 'usuario__sexo']
    search_fields = ['nombre', 'apellidoP', 'apellidoM']
    ordering_fields = ['edad', 'ultimaDonacion']
class DonadorPorUsuarioAPIView(APIView):
    def get(self, request, usuario_id):
        try:
            donador = Donador.objects.get(usuario__id=usuario_id)
            serializer = DonadorSerializer(donador)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Donador.DoesNotExist:
            return Response({"error": "Donador no registrado"}, status=status.HTTP_404_NOT_FOUND)

