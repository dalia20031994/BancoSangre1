from rest_framework import viewsets
from donadores.models import donadores
from donadores.api.serializer import donadoresSerializer

class donadoresViewSet(viewsets.ModelViewSet):
    queryset = donadores.objects.all()
    serializer_class = donadoresSerializer
    
