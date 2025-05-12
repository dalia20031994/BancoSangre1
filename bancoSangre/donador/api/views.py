from rest_framework import viewsets
from donador.models import Donador
from donador.api.serializer import DonadorSerializer
from usuario.api.permissions import IsDonadorCreateReadOnly  # Asegúrate de importar el permiso

#agregado por dalia
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status


class DonadorViewSet(viewsets.ModelViewSet):
    queryset = Donador.objects.all()  # Todos los donadores
    serializer_class = DonadorSerializer  # El serializador de los donadores
    permission_classes = [IsDonadorCreateReadOnly]  # Asigna el permiso aquí para controlar el acceso
class DonadorPorUsuarioAPIView(APIView):
    def get(self, request, usuario_id):
        try:
            donador = Donador.objects.get(usuario__id=usuario_id)
            serializer = DonadorSerializer(donador)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Donador.DoesNotExist:
            return Response({"error": "Donador no registrado"}, status=status.HTTP_404_NOT_FOUND)
