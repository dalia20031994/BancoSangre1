from rest_framework import viewsets
from municipio.models import Municipio
from municipio.api.serializer import MunicipioSerializer
from rest_framework.permissions import IsAuthenticated


class MunicipioViewSet(viewsets.ModelViewSet):
    queryset = Municipio.objects.all()
    serializer_class = MunicipioSerializer
    permission_classes = [IsAuthenticated]
