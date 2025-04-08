from rest_framework import viewsets
from municipio.models import Municipio
from municipio.api.serializer import MunicipioSerializer

class MunicipioViewSet(viewsets.ModelViewSet):
    queryset = Municipio.objects.all()
    serializer_class = MunicipioSerializer
