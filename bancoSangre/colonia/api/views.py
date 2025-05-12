from rest_framework import viewsets
from colonia.models import Colonia
from colonia.api.serializer import ColoniaSerializer
from rest_framework.permissions import IsAuthenticated  # o tu permiso

class ColoniaViewSet(viewsets.ModelViewSet):  # ¡Esto debe estar así!
    queryset = Colonia.objects.all()
    serializer_class = ColoniaSerializer
    permission_classes = [IsAuthenticated]