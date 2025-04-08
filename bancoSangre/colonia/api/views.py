from rest_framework import viewsets
from colonia.models import Colonia
from colonia.api.serializer import ColoniaSerializer

class ColoniaViewSet(viewsets.ModelViewSet):
    queryset = Colonia.objects.all()
    serializer_class = ColoniaSerializer
