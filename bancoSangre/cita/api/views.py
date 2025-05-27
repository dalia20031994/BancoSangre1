from rest_framework import viewsets
from cita.models import Cita
from .serializer import CitaSerializer
from rest_framework.permissions import IsAuthenticated  # o el permiso que uses4
from rest_framework.response import Response
from rest_framework.views import APIView

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    permission_classes = [IsAuthenticated]  # O [AllowAny] para que no pida auth

class CitasPorDonador(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, donador_id):
        citas = Cita.objects.filter(donador_id=donador_id)
        serializer = CitaSerializer(citas, many=True)
        return Response(serializer.data)